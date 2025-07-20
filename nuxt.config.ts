// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt"],

  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  ui: {
    colorMode: true
  },

  runtimeConfig: {
    adminApiBaseUrl: process.env.NUXT_ADMIN_API_BASE_URL
  },

  compatibilityDate: "2025-07-16",

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
