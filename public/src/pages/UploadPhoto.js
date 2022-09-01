import { Camera } from "../components/Camera.js";
import { getUserInfo } from "../lib/user.js";

export const UploadPhoto = {
  template: `
    <v-container fill-height>
      <v-row fill-height justify="center" align-content="center">
        <v-col align="center" cols="10">

          <v-card v-if="imageData">
            <v-img :src="imageData.data" style="width:100%;"/>
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

  props: {
    relatedUserId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      width: 500,
      imageData: null,
    };
  },

  methods: {
    capture(e) {
      this.imageData = e;
    },
    retry() {
      this.imageData = null;
    },
    async send() {
      const body = JSON.stringify({
        image: this.imageData.data,
        id: getUserInfo().userId,
        related_user_id: this.relatedUserId,
      });
      await fetch("/get_image", { method: "POST", body });
      this.$router.go(-3);
    },
  },
};
