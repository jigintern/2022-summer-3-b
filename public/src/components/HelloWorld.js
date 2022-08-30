export const HelloWorld = Vue.component("HelloWorld", {
  template: "<v-btn>{{ hi }}</v-btn>",
  data() {
    return { hi: "Loading..." };
  },

  async created() {
    const response = await fetch("/welcome-message");
    this.hi = await response.text();
  },
});
