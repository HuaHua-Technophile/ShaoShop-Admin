import { createRouter, createWebHistory } from "vue-router";
import { useUserInfoStore } from "../stores/userInfo";
import { addMenuRouter } from "../utils/addMenuRouter/addMenuRouter";
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

      children: [
        {
          path: "test",
          name: "test",
          component: () => import("../views/Test/index.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login/index.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("../views/notFound/index.vue"),
      beforeEnter: async (to, from, next) => {
        const userInfo = useUserInfoStore();
        if (userInfo.authMenuList && userInfo.authMenuList.length > 0) {
          console.log("已添加动态路由,但目标路径未能匹配");
          next();
        } else {
          console.log("动态路由暂未添加", to, from);
          await addMenuRouter();
          next({ path: to.path });
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
