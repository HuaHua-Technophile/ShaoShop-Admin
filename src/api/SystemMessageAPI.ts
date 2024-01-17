import instance from "./instance";
import { systemMessageType, messageQueryFromType } from "@/type/index";
export const getSystemMessage = (params: messageQueryFromType) => {
  return instance<{ records: systemMessageType[]; total: number }>({
    url: "/system/message",
    method: "GET",
    params: {
      currentPage: params.currentPage,
      pageSize: params.pageSize,
      read: params.read,
      startTime: params.timePeriod ? params.timePeriod[0] : null,
      endTime: params.timePeriod ? params.timePeriod[1] : null,
    },
  });
};

// /system/message/{messageId} 根据消息ID查看消息详情

export const getSystemMessageById = (messageId: number) => {
  return instance({
    url: "/system/message/" + messageId,
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
