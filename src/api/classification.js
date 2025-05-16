import axios from "@/axios.js";

// 添加分类
export function create(data) {
  return axios.post("/classification/create", data);
}
//更新
export function update(data) {
  return axios.post("/classification/update", data);
}
//查询
export function get() {
  return axios.get("/classification/get");
}
//删除
export function del(data) {
  return axios.post("/classification/del", data);
}
