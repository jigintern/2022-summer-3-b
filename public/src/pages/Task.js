import { Timer } from "/src/components/Timer.js";

export const Task = {
  template: `
    <div class="d-flex flex-column fill-height">

      <v-card flat tile>
        <div
          class="justify-center"
          style="height: auto; background-color: black;"
        >
          <video
            ref="video"
            class="d-flex ma-auto"
            style="max-width: 100%; max-height: 50vh; height: auto;"
          />
        </div>

        <v-card-actions class="d-flex flex-row">
          タスク
          <v-spacer />
          <v-btn icon @click="flip">
            <v-icon>mdi-camera-flip-outline</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-divider />

      <v-card flat tile>

        <Timer :hour="0" :minute="0" :second="30" @progress="setProgress" />
        <v-progress-linear :value="progress" class="my-5" />

        <v-divider />

        <v-card-title>
          <v-spacer />
            <span class="text-h5">{{taskName}}</span>
          <v-spacer />
        </v-card-title>

        <v-card-actions class="d-flex ma-4">
          <v-spacer />
            <v-btn color="primary" @click="complete" large>完了</v-btn>
          <v-spacer />
        </v-card-actions>

      </v-card>
    </div>
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
    localStream: {
      required: false,
    },
  },

  data() {
    return {
      progress: 100,
      useRemoteStream: true,
      remoteStream: null,
    };
  },

  created() {
    this.ws.onclose = () => this.$router.push({ name: "upload-photo" });
  },

  mounted() {
    const video = this.$refs.video;
    this.connection.on("stream", (stream) => {
      this.remoteStream = stream;
      video.srcObject ??= stream;
      video.play();
    });
  },

  methods: {
    complete() {
      this.ws.close();
    },
    setProgress(progress) {
      this.progress = progress;
    },
    flip() {
      const video = this.$refs.video;
      this.useRemoteStream = !this.useRemoteStream;
      video.srcObject = this.useRemoteStream
        ? this.localStream
        : this.remoteStream;
      video.play();
    },
  },
};
