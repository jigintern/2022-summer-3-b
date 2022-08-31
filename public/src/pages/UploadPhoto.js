import { Camera } from "../components/Camera.js";

export const UploadPhoto = {
  template: `
    <v-container fill-height>
      <v-row justify="center" align-content="center">
        <v-col align="center">

          <v-card v-if="captured" :width="width">
            <v-img :src="captured.data" />
            <v-card-actions>
              <v-btn @click="retry">撮り直し</v-btn>
              <v-spacer />
              <v-btn @click="send" color="primary">送信</v-btn>
            </v-card-actions>
          </v-card>

          <v-card v-else :width="width">
            <camera @capture="capture" :width="width" />
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  `,

  components: { Camera },

  data() {
    return {
      width: 300,
      captured: null,
    };
  },

  methods: {
    capture(e) {
      this.captured = e;
    },
    retry() {
      this.captured = null;
    },
    send() {
      this.$router.go(-3);
    },
  },
};
