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
        // console.log("当前主题色为Dark=>", darkTheme.value);
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.dataset.bsTheme = "light";
        // console.log("当前主题色为Dark=>", darkTheme.value);
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
