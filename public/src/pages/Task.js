import { Timer } from "/src/components/Timer.js";
// import { pending, poll, ready } from "/src/utils/polling.js";

export const Task = {
  template: `
    <v-container fill-height>
      <v-row justify="center" align-content="center">
        <v-col align="center" cols="10">
          <v-card loading>
            <template slot="progress">
              <v-progress-linear :value="progress" />
            </template>
            <Timer :hour="0" :minute="0" :second="30" @progress="setProgress" @complete="complete" />
          </v-card>
        </v-col>
        <v-col cols="10">
          <v-card>
            <v-card-title class="justify-center">
              {{taskName}}
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="complete" depressed>完了</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col align="center" cols="12">
        </v-col>
      </v-row>
    </v-container>
  `,

  components: {
    Timer,
  },

  props: {
    taskName: {
      type: String,
      required: true,
      default: "タスク名",
    },
  },

  data() {
    return {
      progress: 100,
    };
  },

  async created() {
    // // 5秒間隔でポーリング
    // // 間隔は適当
    // const waitSec = 5000;
    // const res = await poll(waitSec, async () => {
    //   const res = await fetch("/api/task/terminated", { method: "POST" });
    //   const json = await res.json();
    //   return json.terminated ? ready(null) : pending();
    // });
  },

  methods: {
    complete() {
      // fetch("/api/task/complete", { method: "POST" });
      this.$router.go(-2);
    },
    setProgress(progress) {
      this.progress = progress;
    },
  },
};
