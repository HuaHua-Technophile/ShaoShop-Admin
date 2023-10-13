import instance from "./instance";
export const login = (data: { password: string; userName: string }) => {
  return instance<{ authentication: string }>({
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
  return instance({
    url: "/system/auth/list-menus",
    method: "GET",
  });
};
