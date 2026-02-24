export default defineNuxtConfig({
  ssr: false,

  app: {
    baseURL: "/taeftar",
  },

  css: ["~/assets/css/main.css"],

  plugins: [{ src: "~/plugins/vuex.ts" }],
});
