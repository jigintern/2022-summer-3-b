export const HelloWorld = Vue.component("HelloWorld", {
  template: "<div>{{ hi }}</div>",
  data() {
    return { hi: "Loading..." };
  },

  async created() {
    const response = await fetch("/welcome-message");
    this.hi = await response.text();
  },
});
