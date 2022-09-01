import { router } from "./router.js";

new Vue({
  el: "#app",
  router,
  vuetify: new Vuetify(),
  template: `
    <v-app><router-view /></v-app>
  `,
});
