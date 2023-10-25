import router from "../../router/index";
import { getAuthMenuList } from "../../api/login";
import { useUserInfoStore } from "../../stores/userInfo";
import { ElMessage } from "element-plus";
export const addMenuRouter = async (to?: { name?: string; path?: string }) => {
  const userInfoStore = useUserInfoStore();
  let authMenuList = await getAuthMenuList();
  userInfoStore.authMenuList = authMenuList.data;
  console.log("页面刷新了,重新获取用户菜单并写入=>", authMenuList);
  if (authMenuList.data) {
    authMenuList.data.forEach(
      (i: { children: any[]; path: string; menuName: string }) => {
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
      }
    );
    ElMessage.success("登陆成功");
    //动态路由挂载之后,再进行匹配404路由
    /* router.addRoute({
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("../../views/notFound/index.vue"),
    }); */
    console.log("所有路由=>", router.getRoutes());
    if (to) router.replace(to); //如果传入了目标跳转,则在添加完动态路由后跳转至目标路由
  } else {
    ElMessage.error(authMenuList.message);
    // 登陆异常一般就是token过期
    router.replace({ name: "login" });
  }
};
