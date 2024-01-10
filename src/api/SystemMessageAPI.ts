import instance from "./instance";
import { systemMessageType } from "@/type/index";
export const getSystemMessage = () => {
  return instance<{ records: systemMessageType[] }>({
    url: "/system/message",
    method: "GET",
  });
};
