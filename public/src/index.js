import { Home } from "/src/pages/Home.js";
import { Matching } from "/src/pages/Matching.js";

const router = new VueRouter({
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/matching", name: "matching", component: Matching, props: true },
  ],
});

new Vue({
  el: "#app",
  router,
  vuetify: new Vuetify(),
  template: `
    <v-app><router-view /></v-app>
  `,
});
