import { PSNQueryType, PSNType } from "@/type";
import { addFun, delFun, editFun, getFun, getListFun } from "@/api/instance";

export const getPSNList = getListFun<PSNType, PSNQueryType>(
  "/specification/list",
  "商品规格"
);
export const addPSN = addFun<PSNType>("/specification", "商品规格");
export const editPSN = editFun<PSNType>("/specification", "商品规格");
export const getPSNificationList = getFun<PSNType, number>(
  "/specification/getProductSpecificationList",
  "下属商品规格和属性"
);
export const delPSN = delFun<number>("/specification", "商品规格");
