import { createRouter, createWebHistory } from "vue-router";
import { useUserInfoStore } from "@/stores/userInfo";
import { addMenuRouter } from "@/utils/addMenuRouter/addMenuRouter";
import { ElMessage } from "element-plus";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/main",
    },
    {
      path: "/main",
      name: "main",
      component: () => import("../views/Main.vue"),
      // 路由守卫
      beforeEnter: (to, from, next) => {
        to;
        from;
        const token = localStorage.getItem("token");
        const userInfoStore = useUserInfoStore();
        if (
          token &&
          token != "" &&
          userInfoStore.authMenuList &&
          userInfoStore.authMenuList.length > 0
        ) {
          next();
        } else {
          console.log("token不存在/userInfoStore未写入动态路由");
          next({ name: "login" });
        }
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login/index.vue"),
    },
    // 未能匹配的地址跳转404
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("../views/notFound/index.vue"),
      beforeEnter: async (to, from, next) => {
        const userInfoStore = useUserInfoStore();
        // 页面刷新后vue中没有路由,只存储在userInfoStore中,需要重新添加
        if (
          userInfoStore.authMenuList &&
          userInfoStore.authMenuList.length > 0
        ) {
          console.log(
            "页面刷新后vue丢失router,重新写入用户信息中存储的路由=>",
            userInfoStore.authMenuList
          );
          let { hasTargetRouter } = addMenuRouter(
            userInfoStore.authMenuList,
            to.path
          );
          hasTargetRouter
            ? next({ path: to.path })
            : next({ name: "notFound" });
        } else {
          ElMessage.error("用户路由列表为空，请重新登陆");
          next({ path: "/login" });
        }
      },
    },
  ],
});
// 全局路由守卫
/* router.beforeEach(async (to, from) => {
  console.log("to,", to, "from", from);
}); */
export default router;
