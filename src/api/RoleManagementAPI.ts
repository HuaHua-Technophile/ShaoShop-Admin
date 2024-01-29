import { getFun, addFun, editFun, instance, delFun_data } from "@/api/instance";
import { roleType, userType } from "@/type/index";
export const getRoleList = getFun<roleType[]>("/system/role/list", "角色列表");
export const delRole = (roleIds: number) => {
  return instance({
    url: "/system/role/" + roleIds,
    method: "DELETE",
  });
};
export const addRole = addFun<roleType>("/system/role", "角色");
export const editRole = editFun<roleType>("/system/role", "角色");
export const getAllocatedList = getFun<userType[], number>(
  "/system/role/authUser/allocatedList",
  "已分配用户列表"
);
export const getUnallocatedList = getFun<userType[], number>(
  "/system/role/authUser/unallocatedList",
  "未分配用户列表"
);
export const cancelUser = delFun_data<{
  roleId: number;
  userIds: (number | undefined)[];
}>("/system/role/authUser/cancelAll", "这些用户的授权");
export const revokeUser = addFun<{
  roleId: number;
  userIds: (number | undefined)[];
}>("/system/role/authUser/allRevoke", "这些用户的授权");
