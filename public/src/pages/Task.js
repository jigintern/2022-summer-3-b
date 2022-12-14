import { getUserInfo } from "../lib/user.js";
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
            playsinline
            ref="video"
            class="d-flex ma-auto"
            style="max-width: 100%; max-height: 50vh; height: auto;"
          />
        </div>

        <v-card-actions class="d-flex flex-row">
          {{remoteUserName}}
          <v-spacer />
          <v-btn @click="useLocalStream=!useLocalStream" color="primary" :text="false" icon>
            <v-icon>mdi-account-convert</v-icon>
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
  },

  data() {
    return {
      progress: 100,
      useLocalStream: false,
      remoteUserName: "",
    };
  },

  async created() {
    const userId = this.connection.userId;
    const res = await fetch(`/api/user?id=${userId}`);
    const json = await res.json();
    this.remoteUserName = json.userName;
  },

  mounted() {
    const video = this.$refs.video;
    video.srcObject ??= this.connection.remoteStream;
    video.play();
  },

  async destroyed() {
    const { peer } = this.connection;
    peer.destroy();

    await fetch("/api/matching/cancel", {
      method: "POST",
      body: JSON.stringify({ userId: getUserInfo().userId }),
    });
  },

  methods: {
    complete() {
      this.$router.push({
        name: "upload-photo",
        params: { relatedUserId: this.connection.userId },
      });
    },
    setProgress(progress) {
      this.progress = progress;
      if (progress === 0) {
        this.complete();
      }
    },
  },

  watch: {
    useLocalStream(useLocal) {
      const video = this.$refs.video;
      video.srcObject = useLocal
        ? this.connection.localStream
        : this.connection.remoteStream;
      video.play();
    },
  },
};
