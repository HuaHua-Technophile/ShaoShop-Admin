import { ref } from "vue";
import { defineStore } from "pinia";
import { authMenuListType } from "../type/index";
export const useUserInfoStore = defineStore(
  "userInfo",
  () => {
    /*在 Setup Store 中：
    ref() 就是 state 属性
    computed() 就是 getters
    function() 就是 actions */
    const authMenuList = ref<authMenuListType[]>([]);
    const userName = ref("");
    const userId = ref(-1);
    return { authMenuList, userName, userId };
  },
  {
    persist: true,
  }
);
