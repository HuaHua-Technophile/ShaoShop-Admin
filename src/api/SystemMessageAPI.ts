import { getFun, getListFun } from "@/api/instance";
import { systemMessageType, messageQueryType } from "@/type/index";
export const getSystemMessage = getListFun<systemMessageType, messageQueryType>(
  "/system/message",
  "站内信"
);
export const getSystemMessageById = getFun<any, number>(
  "/system/message",
  "站内信具体内容"
);
export const getUnReadMessage = getFun<number>(
  "/system/message/unReadMessage",
  "未读站内信数"
);
