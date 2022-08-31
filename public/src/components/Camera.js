export const Camera = {
  template: `
    <v-sheet :width="width">
      <video
        ref="video"
        @loadeddata="initHeight"
        :width="width"
        :height="height"
      />
      <canvas
        v-show="false"
        ref="canvas"
        :width="width"
        :height="height"
      />
      <v-btn @click="capture" icon>
        <v-icon>mdi-camera</v-icon>
      </v-btn>
    </v-sheet>
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
