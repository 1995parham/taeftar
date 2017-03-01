import { createStore } from "vuex";
import { getTimes } from "../lib/pray";
import Cities from "../lib/cities";
import Axios from "axios";

const localStorageAvailable = typeof localStorage !== "undefined";

export const store = createStore({
  strict: false,
  state() {
    return {
      city: {
        name: "",
        loc: [],
      },
      loadingCity: false,
      use_hour: true,
      times: {
        today: 0,
        tomorrow: 0,
      },
      r: [],
      to: "",
      diff: 0,
    };
  },

  getters: {
    available(state) {
      return Boolean(state.city.loc[0] && state.city.loc[1]);
    },
  },

  mutations: {
    setCity(state, city) {
      state.city = city;
      let now = new Date();
      state.times.today = getTimes(now, city.loc);
      state.times.tomorrow = getTimes(
        new Date(now.getTime() + 24 * 60 * 60 * 1000),
        city.loc
      );
    },
    toggleUseHour(state) {
      state.use_hour = !state.use_hour;
    },
    update(state) {
      const now = new Date();
      const s = [
        { to: "سحر", diff: new Date(state.times.today.fajr) - now },
        { to: "افطار", diff: new Date(state.times.today.maghrib) - now },
        { to: "سحر", diff: new Date(state.times.tomorrow.fajr) - now },
      ];

      for (const ss of s) {
        if (ss.diff >= 0) {
          state.to = ss.to;
          state.diff = ss.diff;
          break;
        }
      }

      // Sec
      state.seconds = parseInt(state.diff / 1000);

      // Min
      state.minutes = parseInt(state.seconds / 60);
      state.seconds -= state.minutes * 60;

      // Hour
      if (state.use_hour) {
        state.hours = parseInt(state.minutes / 60);
        state.minutes -= state.hours * 60;
      }

      // R
      state.r = [];
      if (state.use_hour && state.hours > 0) {
        state.r.push({ lbl: "ساعت", val: state.hours });
      }
      state.r.push({ lbl: "دقیقه", val: state.minutes });
      state.r.push({ lbl: "ثانیه", val: state.seconds });
    },
  },

  actions: {
    toggle({ commit }) {
      commit("toggleUseHour");
      commit("update");
    },
    async updateCity({ commit, dispatch }, city) {
      let _city = Cities[city];

      const commitCity = () => {
        commit("setCity", _city);
        commit("update");
        if (localStorageAvailable) {
          localStorage.setItem("currentCity", JSON.stringify(_city));
        }
      };

      if (city && city.length) {
        console.log("Using predefined location!");
        commit("setCity", _city);
        commit("update");
        return;
      }

      // Progressivly find Current location

      // 1. Try to load from cache
      if (localStorageAvailable) {
        Object.assign(_city, JSON.parse(localStorage.getItem("currentCity")));
        console.log("Using local storage cache!");
        commitCity();
      }

      // 2. Use navigator API for more precise location
      let navigatorLoaded = false;

      if (navigator && navigator.geolocation) {
        try {
          const ua = navigator.userAgent.toLowerCase();
          const isAndroid = ua.indexOf("android") > -1;
          navigator.geolocation.getCurrentPosition(
            (position) => {
              navigatorLoaded = true;

              _city.loc = [position.coords.latitude, position.coords.longitude];
              _city.name = "موقعیت فعلی";
              console.log("Using geolocation!");
              commitCity();
            },
            (err) => {
              console.error(err);
            },
            {
              timeout: isAndroid ? 15000 : 5000,
              maximumAge: 60 * 60 * 1000,
            }
          );
        } catch (e) {
          console.error(e);
        }
      }
    },
  },
});
