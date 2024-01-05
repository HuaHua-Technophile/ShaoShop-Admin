import instance from "./instance";

import { dictType, dictDataType } from "@/type";

// get获取所有字典类型
export const getDictList = (params: dictType) => {
  return instance<{ records: dictType[] }>({
    url: `/system/dict/list`,
    method: "get",
    params,
  });
};

// /system/dict/addSysDictType 新增字典类型
export const addDict = (data: dictType) => {
  return instance({
    url: "/system/dict/addSysDictType",
    method: "post",
    data,
  });
};
///system/dict/updateSysDictType 编辑字典类型
export const editDict = (data: dictType) => {
  return instance({
    url: "/system/dict/updateSysDictType",
    method: "put",
    data,
  });
};

// /system/dict-data/addSysDictData 新增字典数据
export const addDictData = (data: dictDataType) => {
  return instance({
    url: "/system/dict-data/addSysDictData",
    method: "post",
    data,
  });
};

// /system/dict-data/updateSysDictData 编辑字典数据
export const editDictData = (data: dictDataType) => {
  return instance({
    url: "/system/dict-data/updateSysDictData",
    method: "put",
    data,
  });
};

// 删除字典类型
export const delDict = (dictId: number) => {
  return instance({
    url: `/system/dict/${dictId}`,
    method: "delete",
  });
};
// /system/dict-data/{dictCodes}删除字典数据
export const delDictData = (dictCodes: number) => {
  return instance({
    url: `/system/dict/data/${dictCodes}`,
    method: "delete",
  });
};
