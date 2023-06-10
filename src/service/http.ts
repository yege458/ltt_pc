import axios, { AxiosRequestConfig } from "axios";
import { useMessage } from "naive-ui";
import NProgress from "nprogress";
const message = useMessage();

export const ipdress = "http://111.230.93.133";
axios.defaults.baseURL = '/api'; //http://111.230.93.133:8081/
axios.defaults.timeout = 10000;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

/** 请求拦截器 */

axios.interceptors.request.use(
  (config: AxiosRequestConfig<any>) => {
    const token = sessionStorage.getItem("token");

    if (token)
      //@ts-ignore
      config.headers["Authorization"] = token;
    config.headers["token"] = token;

    return config;
  },
  error => {
    return error;
  }
);

axios.interceptors.response.use(res => {
  if (res.data.code != 200) {
    console.log(res.data.msg);
    window["$message"].error(res.data.msg);
  }
  return Promise.resolve(res);
});

interface ResType<T> {
  code: number;
  data?: T;
  msg: string;
  err?: string;
}
interface Http {
  get<T>(url: string, params?: unknown): Promise<ResType<T>>;
  post<T>(url: string, params?: unknown): Promise<ResType<T>>;
  upload<T>(url: string, params: unknown): Promise<ResType<T>>;
  download(url: string): void;
}

const http: Http = {
  get(url, params) {
    return new Promise((resolve, reject) => {
      NProgress.start();
      axios
        .get(url, { params })
        .then(res => {
          NProgress.done();
          resolve(res.data);
        })
        .catch(err => {
          NProgress.done();
          reject(err.data);
        });
    });
  },
  post(url, params) {
    return new Promise((resolve, reject) => {
      NProgress.start();
      axios
        .post(url, JSON.stringify(params))
        .then(res => {
          NProgress.done();
          resolve(res.data);
        })
        .catch(err => {
          NProgress.done();
          reject(err.data);
        });
    });
  },
  upload(url, file) {
    return new Promise((resolve, reject) => {
      NProgress.start();
      axios
        .post(url, file, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => {
          NProgress.done();
          resolve(res.data);
        })
        .catch(err => {
          NProgress.done();
          reject(err.data);
        });
    });
  },
  download(url) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    iframe.onload = function () {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
  }
};

export default http;
