import { addFun } from "@/api/instance";
export const logout = addFun("/system/auth/logout", "退出登录信息");
