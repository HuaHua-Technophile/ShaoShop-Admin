import { ref } from "vue";
import { defineStore } from "pinia";
import { authMenuListType } from "../typeing";
export const useUserInfoStore = defineStore("userInfo", () => {
  const isLogged = ref(false);
  const authMenuList = ref<authMenuListType>([]);
  return { isLogged, authMenuList };
});
