import { createStore } from "vuex";
import { getTimes, PrayTimes } from "../lib/pray";
import { defaultCity } from "../lib/cities";
import type { City } from "../lib/cities";

const localStorageAvailable = typeof localStorage !== "undefined";

interface LabeledValue {
  lbl: string;
  val: number;
}

interface State {
  r: LabeledValue[];
  city: City;
  use_hour: boolean;
  times: {
    tomorrow: PrayTimes | null;
    today: PrayTimes | null;
  };
  seconds: number;
  minutes: number;
  hours: number;
  to: string;
  diff: number;
}

async function reversGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fa`,
    );
    const data = await res.json();
    return data.address?.city || data.address?.town || data.address?.state || null;
  } catch {
    return null;
  }
}

export const store = createStore({
  strict: false,

  state(): State {
    return {
      city: {
        name: "",
        loc: [0, 0],
      },
      use_hour: true,
      times: {
        today: null,
        tomorrow: null,
      },
      seconds: 0,
      minutes: 0,
      hours: 0,
      r: Array<LabeledValue>(),
      to: "",
      diff: 0,
    };
  },

  mutations: {
    setCity(state, city) {
      state.city = city;
      let now = new Date();
      state.times.today = getTimes(now, city.loc);
      state.times.tomorrow = getTimes(
        new Date(now.getTime() + 24 * 60 * 60 * 1000),
        city.loc,
      );
    },

    setCityName(state, name: string) {
      state.city.name = name;
    },

    toggleUseHour(state) {
      state.use_hour = !state.use_hour;
    },

    update(state) {
      const now = new Date();

      const next_events: { to: string; diff: number }[] = [
        { to: "سحر", diff: new Date(state.times.today?.fajr) - now },
        { to: "افطار", diff: new Date(state.times.today?.maghrib) - now },
        { to: "سحر", diff: new Date(state.times.tomorrow?.fajr) - now },
      ];
      for (const next_event of next_events) {
        if (next_event.diff >= 0) {
          state.to = next_event.to;
          state.diff = next_event.diff;
          break;
        }
      }

      // difference in seconds
      state.seconds = Math.round(state.diff / 1000);

      // convert difference into minutes
      state.minutes = Math.floor(state.seconds / 60);
      state.seconds = state.seconds % 60;

      // convert difference into hourss
      if (state.use_hour) {
        state.hours = Math.floor(state.minutes / 60);
        state.minutes = state.minutes % 60;
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
    async updateCity({ commit }) {
      const city: City = { ...defaultCity };

      const commitCity = () => {
        commit("setCity", city);
        commit("update");
        if (localStorageAvailable) {
          localStorage.setItem("currentCity", JSON.stringify(city));
        }
      };

      // Show Tehran countdown immediately
      commitCity();

      // 1. Try to load from cache
      if (localStorageAvailable) {
        try {
          const cached = localStorage.getItem("currentCity");
          if (cached) {
            Object.assign(city, JSON.parse(cached));
            commitCity();
          }
        } catch (e) {
          // Clear invalid data
          localStorage.removeItem("currentCity");
        }
      }

      // 2. Use navigator API for more precise location
      if (navigator && navigator.geolocation) {
        try {
          const ua = navigator.userAgent.toLowerCase();
          const isAndroid = ua.indexOf("android") > -1;
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              city.loc = [position.coords.latitude, position.coords.longitude];
              commitCity();

              // 3. Reverse geocode to get city name
              const name = await reversGeocode(city.loc[0], city.loc[1]);
              if (name) {
                city.name = name;
                commit("setCityName", name);
                if (localStorageAvailable) {
                  localStorage.setItem("currentCity", JSON.stringify(city));
                }
              }
            },
            () => {
              // Geolocation error - silently fail
            },
            {
              timeout: isAndroid ? 15000 : 5000,
              maximumAge: 60 * 60 * 1000,
            },
          );
        } catch (e) {
          // Geolocation not supported - silently fail
        }
      }
    },
  },
});
