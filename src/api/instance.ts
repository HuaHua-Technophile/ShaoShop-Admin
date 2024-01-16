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
const instance: AxiosInstance = axios.create({
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

export default instance;
