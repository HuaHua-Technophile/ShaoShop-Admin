import instance from "./instance";
import { PCQueryType, PCType } from "@/type";
export const getPCList = (params?: PCQueryType) => {
  return instance<{
    records: Array<PCType>;
    total: number;
  }>({
    url: "/specification/list",
    method: "GET",
    params,
  });
};
