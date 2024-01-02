import instance from "./instance";

import { dictType } from "@/type";

// 获取所有字典类型
export const getAllDict = () => {
  return instance<dictType[]>({
    url: "/system/dict/list",
    method: "GET",
  });
};
