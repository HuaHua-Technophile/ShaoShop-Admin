import { ref } from "vue";
import { defineStore } from "pinia";
export const useUserInfoStore = defineStore("userInfo", () => {
  const isLogged = ref(false);
  const authMenuList = ref([]);
  return { isLogged, authMenuList };
});
