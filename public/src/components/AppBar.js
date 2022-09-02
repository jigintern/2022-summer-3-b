export const AppBar = {
  template: `
    <v-app-bar color="primary">

      <v-toolbar-title class="white--text text-h4">
        Habi
      </v-toolbar-title>

      <v-spacer />

      <v-btn @click="toggleTheme" icon>
        <v-icon color="white">{{themeIcon}}</v-icon>
      </v-btn>

    </v-app-bar>
  `,

  data() {
    return {
      darkTheme: false,
    };
  },

  methods: {
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
    },
  },

  computed: {
    themeIcon() {
      return this.darkTheme ? "mdi-weather-night" : "mdi-weather-sunny";
    },
  },

  watch: {
    darkTheme() {
      this.$vuetify.theme.dark = this.darkTheme;
    },
  },
};

