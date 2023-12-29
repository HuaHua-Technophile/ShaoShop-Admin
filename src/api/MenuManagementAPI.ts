import instance from "./instance";
import { roleMenuType, treeListType } from "@/type/index";
export const getMenuList = () => {
  return instance<roleMenuType[]>({
    url: "/system/menu/list",
    method: "GET",
  });
};
export const getMenuTreeList = () => {
  return instance<treeListType[]>({
    url: "/system/menu/treeList",
    method: "GET",
  });
};

export const getRoleMenuTreeSelect = (roleId: number) => {
  return instance<{ checkedKeys: number[]; menus: treeListType[] }>({
    url: `/system/menu/roleMenuTreeSelect/${roleId}`,
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
  console.log("准备修改菜单=>", data);
  return instance({
    url: "/system/menu",
    method: "PUT",
    data,
  });
};
export const getMenuDetail = (menuId: number) => {
  return instance({
    url: `/system/menu/${menuId}`,
    method: "GET",
  });
};
export const delMenu = (menuId: number) => {
  return instance({
    url: `/system/menu/${menuId}`,
    method: "DeLETE",
  });
};
