import { ref } from "vue";
import { defineStore } from "pinia";
export const useTokenStore = defineStore("token", () => {
  const token = ref("");
  return {
    token,
  };
});
