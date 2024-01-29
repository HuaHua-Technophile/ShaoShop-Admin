import { addFun, delFun, editFun, getListFun } from "@/api/instance";
import { dictType, dictDataType } from "@/type";

export const getDictList = getListFun<dictType, dictType>(
  "/system/dict/list",
  "字典"
);
export const addDict = addFun<dictType>("/system/dict/addSysDictType", "字典");
export const editDict = editFun<dictType>(
  "/system/dict/updateSysDictType",
  "字典"
);
export const addDictData = addFun<dictDataType>(
  "/system/dict-data/addSysDictData",
  "字典数据"
);
export const editDictData = editFun<dictDataType>(
  "/system/dict-data/updateSysDictData",
  "字典数据"
);
export const delDict = delFun<number>("/system/dict", "字典");
export const delDictData = delFun<number>("/system/dict-data", "字典数据");
