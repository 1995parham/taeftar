<script setup>
  import { cities } from '~/lib/cities'

  definePageMeta({
    validate: (route) => {
      return Boolean(cities[route.params.name]);
    }
  })
</script>

<script>
  import {mapMutations, mapActions, mapGetters} from 'vuex'

  export default {
    mounted() {
      console.log("Mounted");
      this.updateCity(this.$route.params.name || '')
      this.timer = setInterval(this.update.bind(this), 1000);
    },

    methods: {
      ...mapMutations(['update']),
      ...mapActions(['toggle', 'updateCity']),
    },
  }
</script>

<template>
  <div>
    <div class="counter static">
      <div class="counter-circle" @click="toggle" v-if="$store.state.city.loc[0] && $store.state.city.loc[1]">
        <p class="counter-title">{{$store.state.r[0].val}}</p>
        <p class="counter-subtitle">{{$store.state.r[0].lbl}}</p>
        <template v-if="$store.state.r[1].val">
          <p class="counter-subtitle">
            + {{$store.state.r[1].val}} {{$store.state.r[1].lbl}}</p>
        </template>
        <p class="counter-desc">
          <span>مونده تا </span>
          {{$store.state.to}}
        </p>
        <img class="counter-img" src="~/assets/img/eftar.png" alt=""/>
      </div>
      <div v-else>
        <span>در حال دریافت موقعیت...</span>
      </div>
    </div>
  </div>
</template>
