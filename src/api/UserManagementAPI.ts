import instance from "./instance";
import { userType, userListParamsType } from "@/type/index";
export const getUserList = (params?: userListParamsType) => {
  return instance<{ records: Array<userType> }>({
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
