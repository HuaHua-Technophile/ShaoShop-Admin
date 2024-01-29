import { authMenuListType, loginFormType, loginInfoType } from "@/type/index";
import { addFun, getFun } from "@/api/instance";
export const login = addFun<loginInfoType, loginFormType>(
  "/system/auth",
  "登录信息"
);
export const getImage = getFun("/randomSvg", "登录页插图");
export const getAuthMenuList = getFun<authMenuListType[]>(
  "/system/auth/list-menus",
  "已授权路由列表"
);
