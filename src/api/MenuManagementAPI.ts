import instance from "./instance";
import { roleMenuType } from "@/type/index";
export const getMenuList = () => {
  return instance({
    url: "/system/menu/list",
    method: "GET",
  });
};
export const getMenuTreeList = () => {
  return instance({
    url: "/system/menu/treeList",
    method: "GET",
  });
};
export const addMenu = (data: roleMenuType) => {
  console.log("准备添加菜单=>", data);
  return instance({
    url: "/system/menu",
    method: "POST",
    data,
  });
};
export const editMenu = (data: roleMenuType) => {
  return instance({
    url: "/system/menu",
    method: "PUT",
    data,
  });
};
