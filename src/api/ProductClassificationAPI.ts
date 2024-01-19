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
