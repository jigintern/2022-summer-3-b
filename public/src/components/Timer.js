import { Time } from "./Time.js";

export const Timer = {
  template: `
    <v-container>
      <v-row>
        <v-col cols="12">
          <Time :hour='hour_' :minute='minute_' :second='second_'  />
        </v-col>
      </v-row>
    </v-container>
  `,

  components: { Time },

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

  data() {
    return {
      hour_: this.hour,
      minute_: this.minute,
      second_: this.second,
      timer: setInterval(() => this.tick(), 1000),
    };
  },

  methods: {
    calculateProgress() {
      const current = this.hour_ * 60 * 60 + this.minute_ * 60 + this.second_;
      const ratio = current / this.initialSec;
      return ratio * 100;
    },
    update() {
      if (this.second_ > 0) {
        this.second_--;
        return;
      }

      if (this.minute_ > 0) {
        this.minute_--;
        this.second_ = 59;
        return;
      }

      if (this.hour_ > 0) {
        this.hour_--;
        this.minute_ = 59;
        this.second_ = 59;
        return;
      }
    },

    tick() {
      this.update();
      this.$emit("progress", this.calculateProgress());
      if (this.second_ === 0 && this.minute_ === 0 && this.hour_ === 0) {
        clearInterval(this.timer);
        this.$emit("complete");
      }
    },
  },

  computed: {
    initialSec() {
      return this.hour * 60 * 60 + this.minute * 60 + this.second;
    },
  },
};
