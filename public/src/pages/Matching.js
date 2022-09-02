import { connect } from "/src/lib/p2p.js";
import { getUserInfo } from "../lib/user.js";

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

  async destroyed() {
    await fetch("/api/matching/cancel", {
      method: "POST",
      body: JSON.stringify({ userId: getUserInfo().userId }),
    });
  },

  async created() {
    const connection = await connect();

    this.$router.push({
      name: "task",
      params: {
        taskName: this.taskName,
        connection,
      },
    });
  },
};
