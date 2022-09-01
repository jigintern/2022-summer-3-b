export const Habipower = {
  template: `
    <v-card>

      <v-card-title>
        あなたのハビパワー
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row justify="center">

            <v-col cols="auto" class="text-h2 primary--text">
              {{value ?? '-'}}
            </v-col>

          </v-row>
        </v-container>
      </v-card-text>

    </v-card>
  `,

  props: {
    value: {
      type: Number,
      required: false,
    },
  },
};
