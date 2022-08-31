const zeroPadding = (n) => {
  const src = "00" + n;
  return src.slice(-2);
};

export const Time = {
  template: `
    <v-sheet class="text-h3 text-center primary--text">
      {{ timeString }}
    </v-sheet>
  `,

  props: {
    hour: {
      type: Number,
      required: false,
      validator: (v) => 0 <= v && v < 24,
    },
    minute: {
      type: Number,
      required: false,
      validator: (v) => 0 <= v && v < 60,
    },
    second: {
      type: Number,
      required: true,
      validator: (v) => 0 <= v && v < 60,
    },
  },

  computed: {
    timeString() {
      return [this.hour, this.minute, this.second].map(zeroPadding).join(":");
    },
  },
};
