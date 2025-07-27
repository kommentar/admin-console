// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/eslint", "@vueuse/nuxt", "@pinia/nuxt"],

  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  ui: {
    colorMode: true
  },

  runtimeConfig: {
    adminApiBaseUrl: process.env.NUXT_ADMIN_API_BASE_URL,
    adminKey: process.env.NUXT_ADMIN_KEY,
    adminSecret: process.env.NUXT_ADMIN_SECRET,
    sessionSecret: process.env.NUXT_SESSION_SECRET
  },

  compatibilityDate: "2025-07-16",

  nitro: {
    preset: "node-server"
  },

  eslint: {
    config: {
      stylistic: {
        arrowParens: true,
        quotes: "double",
        semi: true,
        commaDangle: "never"
      }
    }
  }
});
