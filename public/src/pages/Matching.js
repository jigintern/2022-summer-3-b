// import { pending, poll, ready } from "/src/utils/polling.js";

export const Matching = {
  template: `
    <v-container fill-height>
      <v-row justify="center" align-content="center">
        <v-col class="text-center" cols="12">
          マッチング中...
        </v-col>
        <v-col align="center" cols="6">
          <v-progress-linear indeterminate rounded />
        </v-col>
      </v-row>
    </v-container>
  `,

  props: {
    taskName: {
      type: String,
      required: true,
    },
  },

  async created() {
    // マッチ開始
    // await fetch("/api/matching/start");

    // // 3秒間隔でポーリング
    // // 間隔は適当
    // const waitSec = 3000;
    // const res = await poll(waitSec, async () => {
    //   const res = await fetch("/api/matching/matched", { method: "POST" });
    //   const json = await res.json();
    //   return json.username ? ready(json) : pending();
    // });

    // マッチ開始までブロック
    await new Promise((resolve) => setTimeout(resolve, 3000));

    this.$router.push({
      name: "task",
      params: {
        taskName: this.taskName,
      },
    });
  },
};
