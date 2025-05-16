import axios from "axios";
import { showMessageBox } from "@/utils/MessageBox.js";
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 使用环境变量
});
console.log(import.meta.env.VITE_API_URL);

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    //自动添加token到请求头
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.authorization = token;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // return response.data.data;
    console.log(response);
    return response.data;
  },
  function (error) {
    // console.log(666);
    // console.log(error);
    if (error.status == 403) {
      showMessageBox("请先登录");
      localStorage.clear();
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // let msg = error.response.data.msg;
    // if (msg == "非法token，请先登录！") {
    //   const { setUserInfo } = useUserStore();
    //   setUserInfo({});
    //   localStorage.removeItem("token");
    //   setTimeout(() => {
    //     location.reload();
    //   }, 1000);
    // }
    // ElNotification({
    //   //   title: err.response.data.errorCode,
    //   message: msg || "登录失败",
    //   type: "error",
    //   duration: 3000,
    // });
    return Promise.reject(error);
  }
);

export default service;
