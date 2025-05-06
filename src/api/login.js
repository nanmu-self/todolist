import axios from "@/axios.js";

// 登录
export function login(data) {
  return axios.post("/auth/login", data);
}
//注册
export function register(data) {
  return axios.post("/auth/register", data);
}
//发送邮箱验证码
export function sendEmailCode(data) {
  return axios.post("/auth/sendyzm", data);
}
