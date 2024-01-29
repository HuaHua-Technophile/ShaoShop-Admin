import { addFun, delFun, editFun, getListFun } from "@/api/instance";
import { PLQueryType, PLType } from "@/type/index";

export const getPLList = getListFun<PLType, PLQueryType>(
  "/label/list",
  "商品标签"
);
export const addPL = addFun<PLType>("/label", "商品标签");
export const editPL = editFun<PLType>("/label", "商品标签");
export const delPL = delFun<(number | undefined)[]>("/label", "商品标签");
