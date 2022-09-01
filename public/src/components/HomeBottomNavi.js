export const HomeBottomNavi = {
  template: `
    <v-bottom-navigation
      :value="value"
      color="primary"
      app
    >

      <v-btn @click="jumpToMainMenu">
        <span>ホーム</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>

        <v-btn @click="jumpToEvaluate">
          <span>評価</span>
          <v-badge :value="requireNotify" dot color="red">
            <v-icon>mdi-heart</v-icon>
          </v-badge>
        </v-btn>

    </v-bottom-navigation>
  `,

  props: {
    notifyEvaluate: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      value: "main-menu",
      current: "main-menu",
    };
  },

  methods: {
    jumpTo(name) {
      if (name !== this.current) {
        this.current = name;
        this.$router.replace({ name });
      }
    },
    jumpToMainMenu() {
      this.jumpTo("main-menu");
    },
    jumpToEvaluate() {
      this.jumpTo("evaluate");
    },
  },

  computed: {
    requireNotify() {
      return this.current !== "evaluate" && this.notifyEvaluate;
    },
  },
};
