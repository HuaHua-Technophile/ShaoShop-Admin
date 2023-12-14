import instance from "./instance";
import { roleTpye } from "@/type/index";
export const getRoleList = () => {
  return instance({
    url: "/system/role/list",
    method: "GET",
  });
};
export const deleteRole = (roleIds: number) => {
  return instance({
    url: "/system/role/" + roleIds,
    method: "DELETE",
  });
};
