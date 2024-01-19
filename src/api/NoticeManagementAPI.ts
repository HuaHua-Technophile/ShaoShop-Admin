import instance from "./instance";
import { systemMessageType } from "@/type/index";

export const getMessage = () => {
  return instance<systemMessageType[]>({
    url: "/message",
    method: "GET",
  });
};

export const sendMessage = (data: systemMessageType) => {
  return instance({
    url: "/message",
    method: "POST",
    data,
  });
};
