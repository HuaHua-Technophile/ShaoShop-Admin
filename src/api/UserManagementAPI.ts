import instance from "./instance";
export const getUserList = () => {
  return instance<{ authentication: string }>({
    url: "/system/user/list",
    method: "GET",
  });
};
