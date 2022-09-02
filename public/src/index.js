import { router } from "./router.js";
import { AppBar } from "/src/components/AppBar.js";

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#7CB342",
      },
      dark: {
        primary: "#9CCC65",
      },
    },
  },
});

new Vue({
  el: "#app",
  router,
  vuetify,
  template: `
    <v-app>
      <app-bar />
      <router-view />
    </v-app>
  `,
  components: { AppBar },
});
