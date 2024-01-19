import {
  productSpecEditType,
  productSpecQueryType,
  productSpecType,
} from "@/type";
import instance from "./instance";

export const getProductSpecList = (params?: productSpecQueryType) => {
  return instance<{
    records: Array<productSpecType>;
    total: number;
  }>({
    url: "/specification/list",
    method: "GET",
    params,
  });
};

//  添加商品规格
export const addProductSpec = (data?: productSpecEditType) => {
  return instance({
    url: "/specification",
    method: "POST",
    data,
  });
};

export const editProductSpec = (data?: productSpecEditType) => {
  console.log("准备修=>", data);
  return instance({
    url: "/specification",
    method: "PUT",
    data,
  });
};

// 获取该specificationsId所有的商品规格和属性
export const getProductSpecificationList = (specificationsId: string) => {
  return instance<productSpecEditType>({
    url: `/specification/getProductSpecificationList/${specificationsId}`,
    method: "GET",
  });
};

// /specification/{specificationsIds} 删除商品规格
export const delProductSpec = (specificationsIds: string) => {
  return instance({
    url: `/specification/${specificationsIds}`,
    method: "put",
  });
};
