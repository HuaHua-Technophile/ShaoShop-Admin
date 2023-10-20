import { createRouter, createWebHistory } from "vue-router";
import { useUserInfoStore } from "../stores/userInfo";

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
      beforeEnter: (to, from, next) => {
        const store = useUserInfoStore();
        if (store.isLogged) {
          console.log("beforeEnter路由守卫:已登录");
          next();
        } else {
          console.log("beforeEnter路由守卫:未登录");
          next({
            name: "login",
          });
        }
      },
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
    },
  ],
});
export default router;
