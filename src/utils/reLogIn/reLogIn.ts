import router from "@/router";
import { useHistoricalNavigationStore } from "@/stores/historicalNavigation";
import { useUserInfoStore } from "@/stores/userInfo";
import { ElMessage } from "element-plus";

const userInfoStore = useUserInfoStore();
const historicalNavigationStore = useHistoricalNavigationStore();
export const reLogIn = (message?: string) => {
  localStorage.removeItem("token"); //清除本地token
  historicalNavigationStore.historicalNavigation = []; //清除历史路由
  userInfoStore.authMenuList = []; // 清除用户对应权限的路由列表
  userInfoStore.removeRouterArr.forEach((i) => {
    i();
  }); //vueRouter通过调用回调,清除动态路由
  console.log("动态路由已清除=>", router.getRoutes());
  ElMessage.success(message);
  router.replace({ name: "login" });
};
