import instance from "./instance";
import { systemMessageType, messageQueryFromType } from "@/type/index";
export const getSystemMessage = (params: messageQueryFromType) => {
  return instance<{ records: systemMessageType[] }>({
    url: "/system/message",
    method: "GET",
    params,
  });
};
// /system/message/unReadMessage 未读消息

export const getUnReadMessage = () => {
  return instance<number>({
    url: "/system/message/unReadMessage",
    method: "GET",
  });
};
