import instance from "./instance";
import { userType, userListParamsType } from "@/type/index";
export const getUserList = (data?: userListParamsType) => {
  return instance({
    url: "/system/user/list",
    method: "GET",
    data: data,
  });
};

export const addUser = (data: userType) => {
  return instance({
    url: "/system/user",
    method: "POST",
    data: data,
  });
};
