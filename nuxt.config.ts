import { resolve } from 'path'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // Fixing Auth0... At what cost... ?
  ssr: false,

  css: [
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    '@/assets/css/theme.css',
  ],

  typescript: {
    shim: false,
  },

  routeRules: {
    '/logout': { redirect: '/' },
  },

  runtimeConfig: {
    MONGO_URL: process.env.MONGO_URL,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'gdc',
    MONGO_COLLECTION_NAME: process.env.MONGO_COLLECTION_NAME || 'missions',
    PBO_MANAGER: process.env.PBO_MANAGER,
    UPLOAD_TEMP_DIR: resolve(process.env.TEMP_DIR!),
    MISSIONS_DIR: resolve(process.env.MISSIONS_DIR!),
    IMAGE_DIR: resolve(process.env.IMAGES_DIR!),

    public: {
      BASE_TITLE: process.env.BASE_TITLE || 'GDC Toolbox',
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || 'gdc.eu.auth0.com',
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_API_IDENTIFIER: process.env.AUTH0_API_IDENTIFIER,
    },
  },

  devtools: {
    enabled: true,
  },
})
