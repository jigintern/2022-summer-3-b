import { Home } from "/src/pages/Home.js";

const router = new VueRouter({
  routes: [
    { path: "/", component: Home },
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
