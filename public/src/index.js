import { HelloWorld } from "/src/components/HelloWorld.js";

const router = new VueRouter({
  routes: [
    { path: "/", component: HelloWorld },
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
