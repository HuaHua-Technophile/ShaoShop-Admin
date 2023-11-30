// import { ref } from "vue";
import { defineStore } from "pinia";
import { stateType } from "@/type/index";

export const useHistoricalNavigationStore = defineStore(
  "historicalNavigation",
  {
    state: (): stateType => {
      return {
        historicalNavigation: [],
      };
    },
    persist: true,
  }
);
