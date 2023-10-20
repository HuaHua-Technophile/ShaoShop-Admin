import instance from "./instance";
export const logout = () => {
  return instance({
    url: "/system/auth/logout",
    method: "POST",
  });
};
