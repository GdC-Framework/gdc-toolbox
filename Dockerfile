FROM node:20-alpine as base

ENV NODE_ENV=production

WORKDIR /app

# Install deps
COPY ./package.json ./yarn.lock ./
RUN npm ci
COPY . .

# Build
RUN npm run build

CMD node .output/server/index.mjs
