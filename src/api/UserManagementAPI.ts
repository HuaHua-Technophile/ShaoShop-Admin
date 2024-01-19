import instance from "./instance";
import { userType, userQueryType } from "@/type/index";
export const getUserList = (params?: userQueryType) => {
  return instance<{ records: Array<userType>; total: number }>({
    url: "/system/user/list",
    method: "GET",
    params,
  });
};

export const addUser = (data: userType) => {
  return instance({
    url: "/system/user",
    method: "POST",
    data,
  });
};

export const editUser = (data: userType) => {
  console.log("准备修改=>", data);
  return instance({
    url: "/system/user",
    method: "PUT",
    data,
  });
};

export const delUser = (userIdList: (number | undefined)[]) => {
  return instance({
    url: `/system/user/batchDel/${userIdList}`,
    method: "DELETE",
  });
};

//  获取个人信息
export const getUserInfo = () => {
  return instance<userType>({
    url: "/system/user/userInfo",
    method: "GET",
  });
};
//  用户修改个人信息
export const updateUserInfo = (data: userType) => {
  return instance({
    url: "/system/user/updateUserInfo",
    method: "PUT",
    data,
  });
};
//  修改密码
export const updateUserPassword = (data: any) => {
  console.log("准备修改密码", data);
  return instance({
    url: "/system/user/updateUserPassword",
    method: "PUT",
    data,
  });
};
