import { addFun, delFun, editFun, getFun } from "@/api/instance";
import { roleMenuType, treeListType } from "@/type/index";
export const getMenuList = getFun<roleMenuType[]>(
  "/system/menu/list",
  "菜单列表"
);
export const getMenuTreeList = getFun<treeListType[]>(
  "/system/menu/treeList",
  "下拉菜单"
);
export const getRoleMenuTreeSelect = getFun<
  { checkedKeys: number[]; menus: treeListType[] },
  number
>("/system/menu/roleMenuTreeSelect", "已授权菜单");
export const addMenu = addFun<roleMenuType>("/system/menu", "菜单");
export const editMenu = editFun<roleMenuType>("/system/menu", "菜单");
export const delMenu = delFun<number>("/system/menu", "菜单");
