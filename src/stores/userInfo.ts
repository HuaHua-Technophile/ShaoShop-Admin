import { ref } from "vue";
import { defineStore } from "pinia";
import { authMenuListType } from "../type/index";
export const useUserInfoStore = defineStore("userInfo", () => {
  const authMenuList = ref<authMenuListType>([]);
  return { authMenuList };
});
