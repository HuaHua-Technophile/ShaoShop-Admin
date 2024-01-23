import instance from "./instance";
import { PCQueryType, PCType } from "@/type";
export const getPCList = (params?: PCQueryType) => {
  return instance<{
    records: Array<PCType>;
    total: number;
  }>({
    url: "/product-classification/list",
    method: "GET",
    params,
  });
};

export const addPC = (data?: PCType) => {
  console.log("准备添加分类=>", data);
  return instance({
    url: "/product-classification",
    method: "POST",
    data,
  });
};
export const editPC = (data?: PCType) => {
  console.log("准备修改分类=>", data);
  return instance({
    url: "/specification",
    method: "PUT",
    data,
  });
};

// /product-classification/{ids} 删除商品分类
export const delPC = (PCId: number) => {
  return instance({
    url: `/product-classification/${PCId}`,
    method: "DELETE",
  });
};
