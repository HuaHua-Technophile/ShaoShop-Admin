import instance from "./instance";

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
