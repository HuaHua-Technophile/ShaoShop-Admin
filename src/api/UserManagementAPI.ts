import instance from "./instance";
import { userType } from "@/type/index";
export const getUserList = (data: any) => {
  console.log("准备发送请求请求用户列表", data);
  return instance({
    url: "/system/user/list",
    method: "GET",
    data: data,
  });
};

export const addUser = (data: userType) => {
  console.log("准备添加用户", data);
  return instance({
    url: "/system/user",
    method: "POST",
    data: data,
  });
};
