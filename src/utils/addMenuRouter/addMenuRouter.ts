import router from "@/router";
import { authMenuListType } from "@/type";
export const addMenuRouter = (
  routerList: authMenuListType[],
  toPath?: string
) => {
  let firstRoute = { name: "" };
  let hasTargetRouter;
  routerList.forEach((i, index) => {
    // 如果有子菜单说明是个空壳二级菜单,需要遍历子菜单添加路由
    if (i.children.length > 0) {
      i.children.forEach((j) => {
        router.addRoute("main", {
          path: j.path,
          name: j.menuName,
          component: () => import(`../../views/${j.path}/index.vue`),
        });
      });
    }
    // 否则是个一级菜单,直接添加路由
    else {
      router.addRoute("main", {
        path: i.path,
        name: i.menuName,
        component: () => import(`../../views/${i.path}/index.vue`),
      });
    }
    //获取首个路由,实现不同路由的用户能自动跳转首屏
    if (index == 0) {
      if (i.children.length > 0) firstRoute.name = i.children[0].menuName;
      else firstRoute.name = i.menuName;
    }
  });
  let allRoutes = router.getRoutes();
  console.log("路由添加完毕=>", allRoutes);
  if (toPath) {
    hasTargetRouter = allRoutes.some((i) => i.path == toPath);
    console.log("要跳转的目标=>", toPath, "已写入vueRouter", hasTargetRouter);
  }
  return { firstRoute, hasTargetRouter };
};
