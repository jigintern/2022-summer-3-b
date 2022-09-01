import { registerUserInfo } from "/src/lib/user.js";

export const Login = {
  template: `
    <v-container fill-height>
      <v-row justify="center">

        <v-col cols="10" align="center">
          <v-card>
            <v-card-title>
              ユーザー登録
            </v-card-title>

            <v-card-text>
              <v-text-field 
                v-model="userName"
                :rules="[v => !!v || 'ユーザー名を入力してください']"
                label="ユーザー名"
              />
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                @click="createUser"
                :disabled="invalidUserName"
                :loading="registering"
                color="primary"
                depressed
              >
                登録
              </v-btn>
            </v-card-actions>

          </v-card>

        </v-col>
      </v-row>
    </v-container>
  `,

  data() {
    return {
      registering: false,
      userName: "",
    };
  },

  methods: {
    async createUser() {
      this.registering = true;

      await registerUserInfo(this.userName);

      this.$router.replace({ name: "home" });
    },
  },

  computed: {
    invalidUserName() {
      return this.userName.length < 1;
    },
  },
};
