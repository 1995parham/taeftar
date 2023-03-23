<template>
  <div class="app-container">
    <div class="header">
      <div class="time-selector static">
        <span>به وقت</span>
        <span>{{ $store.state.city.name }}</span>
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

    <div class="logo">
      <a
        href="https://github.com/1995parham/taeftar"
        target="_blank"
        rel="noopener"
      >
        <img src="~/assets/img/fandogh.png" width="50px" height="50px" alt="" />
      </a>
    </div>
  </div>
</template>

<style>
.city-link {
  text-decoration: none;
  color: #e39657;
  margin-right: 10px;
}

.city-link.active {
  border-bottom: 3px solid #e39657;
}
</style>
