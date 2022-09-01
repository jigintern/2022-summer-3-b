import { EvaluateItem } from "/src/components/EvaluateItem.js";

export const Evaluate = {
  template: `
    <v-container>
      <v-row>
        <v-col cols="12">
          <evaluate-item
            v-if="evaluate"
            :id="evaluate.id"
            :name="evaluate.name"
            :image="evaluate.image"
            @favorite="favorite"
          />
        </v-col>
      </v-row>
    </v-container>
  `,

  components: { EvaluateItem },

  data() {
    return { evaluate: null };
  },

  async created() {
    const res = await fetch("/api/task/evalute");
    this.evaluate = await res.json();
    if (this.evaluate.image === "") {
      this.evaluate.image = "/picture/IMG_1589.jpg";
    }
  },

  methods: {
    favorite() {
      fetch("/api/task/evalute", {
        method: "POST",
        body: JSON.stringify({ id: this.evaluate.id }),
      });
    },
  },
};
