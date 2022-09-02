import { getUserInfo, reRegisterUserInfo } from "../lib/user.js";
import { Habipower } from "/src/components/Habipower.js";

export const MainMenu = {
  template: `
    <v-container fill-height>

      <v-row justify="center" >
        <v-col align="center" cols="10">
          <v-text-field
            v-model="taskName"
            :rules="[v => !!v || 'タスク名は必須です']"
            label="タスク名を入力"
          />
        </v-col>

        <v-col align="center" cols="12">
          <v-btn
            :disabled="invalidTaskName"
            color="primary"
            @click="startMatching"
          >マッチング開始</v-btn>
        </v-col>

      <v-col cols="12">
        <v-divider />
      </v-col>

        <v-col cols="10">
          <habipower :value="habipower" />
        </v-col>
      </v-row>

    </v-container>
  `,

  components: {
    Habipower,
  },

  data() {
    return {
      taskName: "",
      habipower: null,
    };
  },

  async created() {
    const userId = getUserInfo().userId;
    const res = await fetch(`/api/user?id=${userId}`);
    let json = await res.json();

    if (json === null) {
      reRegisterUserInfo();
      const res = await fetch(`/api/user?id=${userId}`);
      json = await res.json();
    }
    this.habipower = json.habipower ?? 0;
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
