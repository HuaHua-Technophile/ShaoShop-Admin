import { userType, userQueryType } from "@/type/index";
import { addFun, delFun, editFun, getFun, getListFun } from "@/api/instance";

export const getUserList = getListFun<userType, userQueryType>(
  "/system/user/list",
  "用户"
);
export const addUser = addFun<userType>("/system/user", "用户");
export const editUser = editFun<userType>("/system/user", "用户");
export const delUser = delFun<(number | undefined)[]>(
  "/system/user/batchDel",
  "用户"
);
export const getUserInfo = getFun<userType>(
  "/system/user/userInfo",
  "该账号信息"
);
export const updateUserInfo = editFun(
  "/system/user/updateUserInfo",
  "个人信息"
);
export const updateUserPassword = editFun(
  "/system/user/updateUserPassword",
  "密码"
);
