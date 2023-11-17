// import { ref } from "vue";
import { defineStore } from "pinia";
import { RouteRecordName } from "vue-router";

interface state {
  historicalNavigation: Array<{
    name: RouteRecordName | undefined;
    path: string;
  }>;
}

export const useHistoricalNavigationStore = defineStore(
  "historicalNavigation",
  {
    state: (): state => {
      return {
        historicalNavigation: [],
      };
    },
    persist: true,
  }
);
