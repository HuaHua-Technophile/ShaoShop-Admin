import { PSNQueryType, PSNType } from "@/type";
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
export const addPSN = (data?: PSNType) => {
  console.log("准备添加规格=>", data);
  return instance({
    url: "/specification",
    method: "POST",
    data,
  });
};

export const editPSN = (data?: PSNType) => {
  console.log("准备修改规格=>", data);
  return instance({
    url: "/specification",
    method: "PUT",
    data,
  });
};

// 获取该specificationsId所有的商品规格和属性
export const getPSNificationList = (PSNId: number) => {
  return instance<PSNType>({
    url: `/specification/getProductSpecificationList/${PSNId}`,
    method: "GET",
  });
};

// /specification/{specificationsIds} 删除商品规格
export const delPSN = (PSNId: number) => {
  return instance({
    url: `/specification/${PSNId}`,
    method: "put",
  });
};
