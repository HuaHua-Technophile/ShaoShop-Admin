// import { ref } from "vue";
import { defineStore } from "pinia";
import { historicalRouteType } from "@/type/index";
import { ref } from "vue";

export const useHistoricalNavigationStore = defineStore(
  "historicalNavigation",
  () => {
    const historicalNavigation = ref<historicalRouteType[]>([]);
    return { historicalNavigation };
  },
  {
    persist: true,
  }
);
