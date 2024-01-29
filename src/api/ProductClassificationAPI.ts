import { addFun, delFun, editFun, getFun, getListFun } from "@/api/instance";
import { PCQueryType, PCType } from "@/type";

export const getPCList = getListFun<PCType, PCQueryType>(
  "/product-classification/list",
  "商品分类"
);
export const addPC = addFun<PCType>("/product-classification", "商品分类");
export const editPC = editFun<PCType>("/product-classification", "商品分类");
export const delPC = delFun<number>("/product-classification", "商品分类");
export const getClassificationIds = getFun<PCType[]>(
  "/product-classification/getClassificationIds",
  "可挂载的父类id"
);
