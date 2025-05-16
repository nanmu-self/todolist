import axios from "@/axios.js";

// 添加任务
export function create(data) {
  return axios.post("/todo/create", data);
}
//更新任务
export function update(data) {
  return axios.post("/todo/update", data);
}
//查询任务
export function get(params) {
  return axios.get("/todo/get", { params });
}
//删除任务
export function del(data) {
  return axios.post("/todo/del", data);
}
