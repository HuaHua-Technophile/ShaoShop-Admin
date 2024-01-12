import { ref } from "vue";
import { defineStore } from "pinia";
export const useDarkThemeStore = defineStore(
  "darkTheme",
  () => {
    const darkTheme = ref(true);
    const toggledarkTheme = () => {
      if (darkTheme.value) {
        document.documentElement.classList.add("dark");
        document.documentElement.dataset.bsTheme = "dark";
        // console.log("toggledarkTheme => dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.dataset.bsTheme = "light";
        // console.log("toggledarkTheme => light");
      }
    };
    return {
      darkTheme,
      toggledarkTheme,
    };
  },
  {
    persist: true,
  }
);
