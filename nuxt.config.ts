export default defineNuxtConfig({
  ssr: false,

  css: ["~/assets/css/circle.css", "~/assets/css/main.css"],

  plugins: [{ src: "~/plugins/vuex.ts" }],
});
