import { Timer } from "/src/components/Timer.js";

export const Task = {
  template: `
    <v-container fill-height>
      <v-row justify="center" align-content="center">
        <v-col align="center" cols="10">
          <v-card loading>
            <template slot="progress">
              <v-progress-linear :value="progress" />
            </template>
            <Timer :hour="1" :minute="0" :second="30" @progress="setProgress" />
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
      <video ref="video"/>
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
    connection: { required: true },
    relatedUserId: {
      type: String,
      required: true,
    },
    ws: {
      type: WebSocket,
      required: true,
    },
  },

  data() {
    return {
      progress: 100,
    };
  },

  created() {
    this.ws.onclose = () => this.$router.push({ name: "upload-photo" });
  },

  mounted() {
    this.connection.on("stream", (stream) => {
      this.$refs.video.srcObject = stream;
      this.$refs.video.play();
    });
  },

  methods: {
    complete() {
      this.ws.close();
    },
    setProgress(progress) {
      this.progress = progress;
    },
  },
};
