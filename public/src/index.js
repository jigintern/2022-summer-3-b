import { Home } from "/src/pages/Home.js";
import { Matching } from "/src/pages/Matching.js";
import { Task } from "./pages/Task.js";
import { UploadPhoto } from "./pages/UploadPhoto.js";
import { Evaluate } from "./pages/Evaluate.js";
import { MainMenu } from "./pages/MainMenu.js";

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      redirect: { name: "main-menu" },
      children: [
        { path: "main-menu", name: "main-menu", component: MainMenu },
        { path: "evaluate", name: "evaluate", component: Evaluate },
      ],
    },
    { path: "/matching", name: "matching", component: Matching, props: true },
    { path: "/task", name: "task", component: Task, props: true },
    { path: "/upload-photo", name: "upload-photo", component: UploadPhoto },
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
