<script setup>
import { useStore } from "vuex";

const store = useStore();
useHead({
  title: computed(() =>
    store.state.city.name ? `تا افطار - ${store.state.city.name}` : "تا افطار"
  ),
});
</script>

<script>
import { mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      timer: null,
    };
  },

  mounted() {
    this.updateCity();
    this.timer = setInterval(this.update.bind(this), 1000);
  },

  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  methods: {
    ...mapMutations(["update"]),
    ...mapActions(["toggle", "updateCity"]),
  },
};
</script>

<template>
  <div>
    <div class="counter static">
      <div
        class="counter-circle"
        @click="toggle"
        v-if="$store.state.city.loc[0] && $store.state.city.loc[1]"
      >
        <p class="counter-title">{{ $store.state.r[0].val }}</p>
        <p class="counter-subtitle">{{ $store.state.r[0].lbl }}</p>
        <template v-if="$store.state.r[1].val">
          <p class="counter-subtitle">
            + {{ $store.state.r[1].val }} {{ $store.state.r[1].lbl }}
          </p>
        </template>
        <p class="counter-desc">
          <span>مونده تا </span>
          {{ $store.state.to }}
        </p>
        <img class="counter-img" src="~/assets/img/eftar.png" alt="" />
      </div>
      <div v-else>
        <span>در حال دریافت موقعیت...</span>
      </div>
    </div>
  </div>
</template>
