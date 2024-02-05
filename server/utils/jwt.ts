import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

const runtimeConfig = useRuntimeConfig()

const asyncVerify = (
  token: string,
  secret?: jwt.Secret | jwt.GetPublicKeyOrSecret,
  opts?: jwt.VerifyOptions
) => new Promise<jwt.JwtPayload | string | undefined>(
  (resolve, reject) => jwt.verify(
    token,
    secret || '',
    opts,
    (err, decoded) => err ? reject(err) : resolve(decoded),
  )
)

const jwksClient = new JwksClient({
  jwksUri: `https://${runtimeConfig.public.AUTH0_DOMAIN}/.well-known/jwks.json`
});
const getJWTSecret = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
  jwksClient.getSigningKey(header.kid)
    .then((key) => callback(null, key?.getPublicKey()))
    .catch((err) => callback(err))
}

export const checkJWT = async (event: H3Event) => {
  const header = getHeader(event, 'authorization');
  const token = /Bearer (.*)/i.exec(header || '')?.at(1);
  const res = jwt.decode(token || '', { json: true });

  if (!res || !token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Please provide a valid token'
    })
  }

  let decoded;
  try {
    decoded = await asyncVerify(
      token,
      getJWTSecret,
      {
        issuer: `https://${runtimeConfig.public.AUTH0_DOMAIN}/`,
        audience: runtimeConfig.public.AUTH0_API_IDENTIFIER,
      }
    );
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Token expired'
      })
    }

    if (error instanceof jwt.NotBeforeError) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Token not active'
      })
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw createError({
        statusCode: 403,
        statusMessage: error.message
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : `${error}`
    })
  }

  if (!decoded) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Token is invalid'
    })
  }

  return decoded;
}

export const checkUserPermission = async (event: H3Event, permission: string) => {
  const jwt = await checkJWT(event);

  if (typeof jwt === 'string') {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cannot parse token'
    })
  }

  if (!Array.isArray(jwt.permissions) || !jwt.permissions.includes(permission)) {
    throw createError({
      statusCode: 403,
      statusMessage: "You don't have the permission to perform this action"
    })
  }
}
