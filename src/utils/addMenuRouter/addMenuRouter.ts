import router from "../../router/index";
import { getAuthMenuList } from "../../api/login";
import { useUserInfoStore } from "../../stores/userInfo";
import { ElMessage } from "element-plus";
import { RouteLocationRaw } from "vue-router";
export const addMenuRouter = async (
  toFirst: boolean,
  to?: { name?: string; path?: string }
) => {
  const userInfoStore = useUserInfoStore();
  let authMenuList = await getAuthMenuList();
  console.log("获取到的路由列表=>", authMenuList, userInfoStore.authMenuList);
  return new Promise((resolve) => {
    // 如果返回了data字段,说明成功登录并且请求路由列表
    if (authMenuList.data && authMenuList.data.length > 0) {
      let firstRoute = { name: "" };
      userInfoStore.authMenuList = authMenuList.data; //赋值进入pinia
      authMenuList.data.forEach(
        (
          i: { children: any[]; path: string; menuName: string },
          index: number
        ) => {
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

          //获取首个路由,实现不同的权限的后台管理系统用户能自动跳转首屏
          if (index === 0 && i.children.length > 0) {
            firstRoute.name = i.children[0].menuName;
          } else if (index === 0) firstRoute.name = i.menuName;
        }
      );

      //如果传入了目标跳转,则在添加完动态路由后跳转至目标路由
      if (to) router.replace(to);
      else if (toFirst) router.replace(firstRoute);
      else resolve(true);
    }
    // 否则说明登陆异常,token过期,需要重新进入登录页
    else {
      ElMessage.error(authMenuList.message);
      resolve("没能获取到用户的路由列表");
    }
  });
};
