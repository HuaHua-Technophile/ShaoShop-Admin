import instance from "./instance";
import { FRQueryType, FRType } from "@/type";

// /reductionRule/list
export const getFRList = (params?: FRQueryType) => {
  return instance<{
    records: Array<FRType>;
    total: number;
  }>({
    url: "/reductionRule/list",
    method: "GET",
    params,
  });
};
