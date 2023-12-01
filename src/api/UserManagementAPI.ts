import instance from "./instance";
import { userType, userListParamsType } from "@/type/index";
export const getUserList = (params?: userListParamsType) => {
  return instance({
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
