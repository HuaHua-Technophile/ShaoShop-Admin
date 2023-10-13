import { createRouter, createWebHashHistory } from "vue-router";
import { useUserInfoStore } from "../stores/userInfo";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/Home.vue"),
      beforeEnter: (to, from, next) => {
        const store = useUserInfoStore();
        if (store.isLogged) {
          console.log("已登录");
          next();
        } else {
          console.log("未登录");
          next({
            name: "login",
          });
        }
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login/Login.vue"),
    },
  ],
});
export default router;
