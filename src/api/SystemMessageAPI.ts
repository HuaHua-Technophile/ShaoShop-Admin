import instance from "./instance";
import { systemMessageType } from "@/type/index";
export const getSystemMessage = () => {
  return instance<{ records: systemMessageType[] }>({
    url: "/system/message",
    method: "GET",
  });
};
// /system/message/unReadMessage 未读消息

export const getUnReadMessage = () => {
  return instance<number>({
    url: "/system/message/unReadMessage",
    method: "GET",
  });
};
