// 安装axios
// $pnpm i axios -S
import { reLogIn } from "@/utils/reLogIn/reLogIn";
import axios from "axios";
import {
  Axios,
  AxiosRequestConfig,
  AxiosDefaults,
  HeadersDefaults,
  AxiosHeaderValue,
  RawAxiosResponseHeaders,
  AxiosResponseHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";

// 重写接口-----------------------
interface AxiosResponse<T = any, D = any> {
  code: number; //添加自己需要的
  data: T;
  message: string; //添加自己需要的
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<D>;
  request?: any;
}
interface AxiosInstance extends Axios {
  <T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<R>;
  <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  defaults: Omit<AxiosDefaults, "headers"> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue;
    };
  };
}

// 创建axios初始化-----------------------
export const instance: AxiosInstance = axios.create({
  baseURL: "http://192.168.1.14:8088", // 基本URL
  timeout: 30000, //超时时间
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  // withCredentials: true, //自动获取cookie信息
});

// request 拦截器 发送数据到后台拦截--------------
instance.interceptors.request.use(
  (config) => {
    // 添加token
    const token = localStorage.getItem("token");
    if (token && token != "") config.headers["token"] = token;
    return config;
  },
  (error) => {
    // console.log("axios中request报错", error);
    Promise.reject(error);
  }
);

// response 拦截器 后台返回前台拦截---------------------
instance.interceptors.response.use(
  (config) => {
    if (config.data.code == 401) reLogIn(config.data.message);
    else if (config.data.code && config.data.code != 200)
      ElMessage.error(config.data.message);
    return config.data;
  },
  (error) => {
    // console.log("axios中response报错", error);
    Promise.reject(error);
  }
);

// 二次封装常用接口,加入debug语句-----------------------
export const addFun = <dataType, resType = any>(
  url: string,
  addStr: string
) => {
  return (data?: dataType) => {
    console.log(`准备添加${addStr}=>`, data);
    return instance<resType>({
      url,
      method: "POST",
      data,
    });
  };
};
export const delFun = <delType>(url: string, delStr: string) => {
  return (data: delType) => {
    console.log(`准备删除${delStr}=>`, data);
    return instance({
      url: url + "/" + data,
      method: "DELETE",
    });
  };
};
export const delFun_data = <delType>(url: string, delStr: string) => {
  return (data?: delType) => {
    console.log(`准备删除${delStr}=>`, data);
    return instance({
      url,
      method: "DELETE",
      data,
    });
  };
};
export const editFun = <dataType>(url: string, editStr: string) => {
  return (data: dataType) => {
    console.log(`准备修改${editStr}=>`, data);
    return instance({
      url,
      method: "PUT",
      data,
    });
  };
};
export const getListFun = <resType, paramsType = undefined>(
  url: string,
  queryStr: string
) => {
  return (params: paramsType) => {
    if (params) console.log(`查询${queryStr}列表条件=>`, params);
    return instance<{ records: resType[]; total: number }>({
      url,
      method: "GET",
      params,
    });
  };
};
export const getFun = <resType, paramsType = undefined>(
  url: string,
  queryStr: string
) => {
  return (params?: paramsType) => {
    if (params) console.log(`获取`, params, `的${queryStr}↓`);
    else console.log(`准备获取${queryStr}↓`);
    return instance<resType>({
      url: params ? url + "/" + params : url,
      method: "GET",
    });
  };
};
