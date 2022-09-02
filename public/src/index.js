import { router } from "./router.js";
import { AppBar } from "/src/components/AppBar.js";

new Vue({
  el: "#app",
  router,
  vuetify: new Vuetify(),
  template: `
    <v-app>
      <app-bar />
      <router-view />
    </v-app>
  `,
  components: { AppBar },
});
