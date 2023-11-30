import instance from "./instance";
import { userType } from "@/type/index";
export const getUserList = () => {
  return instance({
    url: "/system/user/list",
    method: "GET",
  });
};

export const addUser = (data: userType) => {
  return instance({
    url: "/system/user",
    method: "POST",
    data: data,
  });
};
