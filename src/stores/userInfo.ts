import { ref } from "vue";
import { defineStore } from "pinia";
import { authMenuListType } from "../type/index";
export const useUserInfoStore = defineStore(
  "userInfo",
  () => {
    /*在 Setup Store 中:
    ref() 就是 state 属性
    computed() 就是 getters
    function() 就是 actions */
    const authMenuList = ref<authMenuListType[]>([]);
    const removeRouterArr = ref<{ (): void }[]>([]); //将所有动态路由暂存,在退出登录时清除动态路由
    const userName = ref("");
    const userId = ref(-1);
    return { authMenuList, userName, userId, removeRouterArr };
  },
  {
    persist: {
      paths: ["authMenuList", "userName", "userId"], //配置哪些数据需要持久化
    },
  }
);
