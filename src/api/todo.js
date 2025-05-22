import axios from "@/axios.js";

// 添加任务
export function createTodo(data) {
  return axios.post("/todo/create", data);
}
//更新任务
export function updateTodo(data) {
  return axios.post("/todo/update", data);
}
//查询任务
export function getTodoApi(params) {
  return axios.get("/todo/get", { params });
}
//删除任务
export function delTodo(data) {
  return axios.post("/todo/del", data);
}
//批量更新
export function batchUpdateTodo(data) {
  return axios.post("/todo/batchUpdate", data);
}
