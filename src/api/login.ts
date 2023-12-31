import { authMenuListType, loginInfoType } from "../type/index";
import instance from "./instance";
export const login = (data: { password: string; userName: string }) => {
  return instance<loginInfoType>({
    url: "/system/auth",
    method: "POST",
    data,
  });
};
export const getImage = () => {
  return instance({
    url: "/randomSvg",
    method: "GET",
  });
};

export const getAuthMenuList = () => {
  return instance<authMenuListType>({
    url: "/system/auth/list-menus",
    method: "GET",
  });
};
