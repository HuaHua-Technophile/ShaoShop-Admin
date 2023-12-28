import instance from "./instance";
import { roleType } from "@/type/index";
export const getRoleList = () => {
  return instance({
    url: "/system/role/list",
    method: "GET",
  });
};
export const delRole = (roleIds: number) => {
  return instance({
    url: "/system/role/" + roleIds,
    method: "DELETE",
  });
};

export const addRole = (data: roleType) => {
  console.log("尝试添加该角色=>", data);
  /* return instance({
    url: "/system/role",
    method: "POST",
    data,
  }); */
};

export const editRole = (data: roleType) => {
  return instance({
    url: "/system/role",
    method: "PUT",
    data,
  });
};
