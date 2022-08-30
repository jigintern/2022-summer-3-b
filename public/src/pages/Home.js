export const Home = {
  template: `
    <v-container fill-height>
      <v-row justify="center" align-content="center">
        <v-col align="center" cols="10">
          <v-text-field
            v-model="taskName"
            :rules="[v => !!v || 'タスク名は必須です']"
            label="タスク名を入力"
          />
          <v-btn
            :disabled="invalidTaskName"
            color="primary"
            @click="startMatching"
          >マッチング開始</v-btn>
        </v-col>
      </v-row>
    </v-container>
  `,
  data() {
    return { taskName: "" };
  },

  methods: {
    async startMatching() {},
  },

  computed: {
    invalidTaskName() {
      return this.taskName.length == 0;
    },
  },
};
