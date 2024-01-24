import instance from "./instance";
import { PLQueryType, PLType } from "@/type/index";

export const getPLList = (params: PLQueryType) => {
  return instance<{
    records: Array<PLType>;
    total: number;
  }>({
    url: "/label/list",
    method: "GET",
    params,
  });
};

export const addPL = (data: PLType) => {
  console.log("准备添加标签=>", data);
  return instance({
    url: "/label",
    method: "POST",
    data,
  });
};

export const editPL = (data: PLType) => {
  console.log("准备修改标签=>", data);
  return instance({
    url: "/label",
    method: "PUT",
    data,
  });
};

// /label/{ids} 删除标签
export const delPL = (PLIds: (number | undefined)[]) => {
  return instance({
    url: `/label/${PLIds}`,
    method: "DELETE",
  });
};
