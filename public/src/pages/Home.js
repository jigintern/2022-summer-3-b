import { HomeBottomNavi } from "/src/components/HomeBottomNavi.js";

export const Home = {
  template: `
    <div class="fill-height">

      <v-main class="fill-height">
        <router-view />
      </v-main>

      <home-bottom-navi :notifyEvaluate="hasNotifications" />

    </div>
  `,

  components: {
    HomeBottomNavi,
  },

  data() {
    return {
      taskName: "",
      hasNotifications: false,
    };
  },

  async created() {
    // 仮のuser id
    const userId = Math.floor(Math.random() * 10);

    const body = JSON.stringify({ id: userId });
    const res = await fetch("/api/habipower", { method: "POST", body });
    const json = await res.json();
    this.hasNotifications = json.has_notifications;
  },

  methods: {
    startMatching() {
      this.$router.push({
        name: "matching",
        params: {
          taskName: this.taskName,
        },
      });
    },
  },

  computed: {
    invalidTaskName() {
      return this.taskName.length == 0;
    },
  },
};
