import { PSNEditType, PSNQueryType, PSNType } from "@/type";
import instance from "./instance";

export const getPSNList = (params?: PSNQueryType) => {
  return instance<{
    records: Array<PSNType>;
    total: number;
  }>({
    url: "/specification/list",
    method: "GET",
    params,
  });
};

//  添加商品规格
export const addPSN = (data?: PSNEditType) => {
  return instance({
    url: "/specification",
    method: "POST",
    data,
  });
};

export const editPSN = (data?: PSNEditType) => {
  console.log("准备修=>", data);
  return instance({
    url: "/specification",
    method: "PUT",
    data,
  });
};

// 获取该specificationsId所有的商品规格和属性
export const getPSNificationList = (specificationsId: string) => {
  return instance<PSNEditType>({
    url: `/specification/getPSNificationList/${specificationsId}`,
    method: "GET",
  });
};

// /specification/{specificationsIds} 删除商品规格
export const delPSN = (specificationsIds: string) => {
  return instance({
    url: `/specification/${specificationsIds}`,
    method: "put",
  });
};
