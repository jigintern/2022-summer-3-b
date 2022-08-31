export const EvaluateItem = {
  template: `
    <v-card>

      <v-img :src="image" />

      <v-card-actions>
        {{name}}
        <v-spacer />
        <v-icon
          @click=click
          :color="favoriteIconColor"
        >
            {{favoriteIconName}}
          </v-icon>
      </v-card-actions>

    </v-card>
  `,

  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      favorite: false,
    };
  },

  methods: {
    click() {
      this.favorite = !this.favorite;
      this.$emit(this.favorite ? "favorite" : "cancel");
    },
  },

  computed: {
    favoriteIconName() {
      return this.favorite ? "mdi-heart" : "mdi-heart-outline";
    },
    favoriteIconColor() {
      return this.favorite ? "pink" : "grey";
    },
  },
};
