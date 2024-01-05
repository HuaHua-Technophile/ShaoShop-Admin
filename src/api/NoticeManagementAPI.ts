import instance from "./instance";
import { messageType } from "@/type/index";

export const getMessage = () => {
  return instance<messageType[]>({
    url: "/message",
    method: "GET",
  });
};

export const sendMessage = (data: messageType) => {
  return instance({
    url: "/message",
    method: "POST",
    data,
  });
};
