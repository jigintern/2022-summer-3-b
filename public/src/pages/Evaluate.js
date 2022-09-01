import { getUserInfo } from "/src/lib/user.js";
import { EvaluateItem } from "/src/components/EvaluateItem.js";

export const Evaluate = {
  template: `
    <v-container>
      <v-row>
        <v-col cols="12">

          <v-card v-if="!evaluates.length">
            <v-card-text>
              評価する写真はありません
            </v-card-text>
          </v-card>

          <v-list v-for="(e, i) in evaluates">

            <evaluate-item
              :key="i"
              :name="e.userName"
              :image="e.image"
              @favorite="favorite(e.userId)"
            />

          </v-list>

        </v-col>
      </v-row>
    </v-container>
  `,

  components: { EvaluateItem },

  data() {
    return { evaluates: [] };
  },

  async created() {
    const userId = getUserInfo().userId;
    const query = new URLSearchParams({ id: userId });
    const res = await fetch(`/api/task/evalute?${query}`);

    const evaluates = await res.json();
    for (const e of evaluates) {
      e.image ||= "/picture/IMG_1589.jpg";
    }
    this.evaluates = evaluates;
  },

  methods: {
    favorite(userId) {
      console.log(userId);
      fetch("/api/task/evalute", {
        method: "POST",
        body: JSON.stringify({ id: userId }),
      });
    },
  },
};
