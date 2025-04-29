import axios from "@/axios.js";
import { useDataStore } from "@/stores/userStore.js";

// 登录
export function login(data) {
  return axios.post("/admin/login", data);
}
//生成验证码
export function getCode(scene) {
  const store = useDataStore();
  // 添加一个uuid请求头
  return axios.post("/login/getcode", {
    uuid: store.fingerprint,
    scene,
  });
}
