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
  return instance({
    url: "/system/role",
    method: "POST",
    data,
  });
};

export const editRole = (data: roleType) => {
  console.log("尝试编辑该角色=>", data);
  return instance({
    url: "/system/role",
    method: "PUT",
    data,
  });
};

// /system/role/authUser/allocatedList/{roleId} 查询已分配用户角色列表
export const getAllocatedList = (roleId: number) => {
  return instance({
    url: "/system/role/authUser/allocatedList/" + roleId,
    method: "GET",
  });
};

// /system/role/authUser/unallocatedList/{roleId} 查询未分配用户角色列表
export const getUnallocatedList = (roleId: number) => {
  return instance({
    url: "/system/role/authUser/unallocatedList/" + roleId,
    method: "GET",
  });
};

//  /system/role/authUser/cancelAll 批量取消授权
export const cancelUser = (roleId: number, userId: number[]) => {
  return instance({
    url: "/system/role/authUser/cancelAll",
    method: "DELETE",
    data: {
      roleId,
      userId,
    },
  });
};

// /system/role/authUser/allRevoke 批量授权用户
export const revokeUser = (roleId: number, userIds: (number | undefined)[]) => {
  console.log(`尝试为ID${roleId}授权用户=>`, userIds);
  return instance({
    url: "/system/role/authUser/allRevoke",
    method: "POST",
    data: {
      roleId,
      userIds,
    },
  });
};
