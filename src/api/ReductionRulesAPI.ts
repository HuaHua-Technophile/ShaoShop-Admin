import { addFun, delFun, editFun, getListFun } from "@/api/instance";
import { FRQueryType, FRType } from "@/type";

export const getFRList = getListFun<FRType, FRQueryType>(
  "/reductionRule/list",
  "满减规则"
);
export const addFR = addFun<FRType>("/reductionRule", "满减规则");
export const editFR = editFun<FRType>("/reductionRule", "满减规则");
export const delFR = delFun<FRType>("/reductionRule", "满减规则");
