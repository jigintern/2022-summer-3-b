import { Camera } from "../components/Camera.js";

export const UploadPhoto = {
  template: `
    <v-container fill-height>
      <v-row fill-height justify="center" align-content="center">
        <v-col align="center" cols="10">

          <v-card v-if="captured">
            <v-img :src="captured.data" style="width:100%;"/>
            <v-card-actions>
              <v-btn @click="retry">撮り直し</v-btn>
              <v-spacer />
              <v-btn @click="send" color="primary">送信</v-btn>
            </v-card-actions>
          </v-card>

          <v-card v-else>
            <camera @capture="capture" :width="width" />
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  `,

  components: { Camera },

  data() {
    return {
      width: 500,
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
