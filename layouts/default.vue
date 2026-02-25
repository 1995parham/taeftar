<template>
  <div class="app-container">
    <div class="header">
      <div class="time-selector static">
        <span>به وقت </span>
        <span
          v-if="!isSearching"
          class="city-name"
          @click="startSearch"
        >{{ $store.state.city.name }}</span>
        <input
          v-else
          ref="searchInput"
          v-model="searchQuery"
          class="city-search-input"
          placeholder="نام شهر..."
          @keydown.enter="submitSearch"
          @keydown.esc="cancelSearch"
          @blur="cancelSearch"
        />
        <span
          v-if="$store.state.locationSource"
          class="location-source"
        >{{ $store.state.locationSource }}</span>
      </div>

      <div
        class="info static"
        v-if="$store.state.city.loc[0] && $store.state.city.loc[1]"
      >
        <span>اذان مغرب : </span>
        <span>{{ $store.state.times.today["maghribo"] }}</span>
        <br />
        <span>اذان صبح : </span>
        <span>{{ $store.state.times.today["fajro"] }}</span>
      </div>
    </div>

    <slot></slot>

    <div class="logo right">
      <a href="https://github.com/fandogh" target="_blank" rel="noopener">
        <img src="~/assets/img/fandogh.png" width="50" height="50" alt="" />
      </a>
    </div>

    <div class="logo left">
      <a href="https://github.com/1995parham" target="_blank" rel="noopener">
        <img
          src="~/assets/img/1995parham-logo.svg"
          width="75"
          height="50"
          alt=""
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useStore } from "vuex";

const store = useStore();
const isSearching = ref(false);
const searchQuery = ref("");
const searchInput = ref<HTMLInputElement | null>(null);

function startSearch() {
  isSearching.value = true;
  searchQuery.value = "";
  nextTick(() => {
    searchInput.value?.focus();
  });
}

async function submitSearch() {
  const query = searchQuery.value.trim();
  if (!query) {
    cancelSearch();
    return;
  }
  const success = await store.dispatch("searchCity", query);
  isSearching.value = false;
  searchQuery.value = "";
}

function cancelSearch() {
  isSearching.value = false;
  searchQuery.value = "";
}
</script>

<style>
.city-name {
  cursor: pointer;
}

.city-name:hover {
  border-bottom: 2px solid #d4d83e;
}
</style>
