export const Camera = {
  template: `
    <v-container fill-height>
      <v-row fill-height justify="center" align-content="center">

        <v-col align="center" cols="12">
          <video
            ref="video"
            @loadeddata="initHeight"
            style="width: 100%;"
          />
        </v-col>

        <v-col align="center" cols="12">
          <v-btn @click="capture" icon>
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </v-col>

      </v-row>

      <canvas
        v-show="false"
        ref="canvas"
        :width="width"
        :height="height"
      />

    </v-container>
  `,

  data() {
    return {
      height: this.width,
    };
  },

  props: {
    width: {
      type: Number,
      required: true,
    },
  },

  async mounted() {
    const video = this.$refs.video;
    try {
      video.srcObject = await navigator.mediaDevices?.getUserMedia?.({
        video: true,
      });
      video.play();
    } catch {
      this.$emit("deny");
    }
  },

  methods: {
    initHeight() {
      const video = this.$refs.video;
      const aspect = video.videoHeight / video.videoWidth;
      this.height = this.width * aspect;
    },

    capture() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;

      canvas.getContext("2d").drawImage(video, 0, 0, this.width, this.height);

      const base64 = canvas.toDataURL("image/png");
      this.$emit("capture", {
        data: base64,
        width: this.width,
        height: this.height,
      });
    },
  },
};
