import { defineStore } from "pinia";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { ref, computed, watch } from "vue";
import { showMessageBox } from "../utils/MessageBox.js";
export const useDataStore = defineStore("userdata", () => {
  const intention = ref("all");
  const selectedCategory = ref(0); //分类
  const fingerprint = ref(""); //用户指纹
  const token = ref(localStorage.getItem("token") || "");
  const email = ref(localStorage.getItem("email") || "");
  const categorys = ref([
    {
      id: 1,
      title: "工作",
    },
    {
      id: 2,
      title: "生活",
    },
    {
      id: 3,
      title: "学习",
    },
  ]);
  const todos = ref([
    {
      id: 1,
      title: "Buy groceries",
      completed: false,
      category: 1,
    },
    {
      id: 2,
      title: "Clean the house",
      completed: true,
      category: 2,
    },
    {
      id: 3,
      title: "学习英语",
      completed: true,
      category: 3,
    },
  ]);
  //持久化存储token
  watch(token, (newVal) => {
    localStorage.setItem("token", newVal);
  });
  //持久化存储userInfo
  watch(email, (newVal) => {
    localStorage.setItem("email", newVal);
  });
  //条件筛选
  const conditionFilter = computed(() => {
    let filtered = todos.value;
    // 分类过滤（当选择非0时生效）
    if (selectedCategory.value !== 0) {
      filtered = filtered.filter(
        (todo) => todo.category === selectedCategory.value
      );
    }
    // 状态过滤
    switch (intention.value) {
      case "all":
        break;
      case "ongoing":
        filtered = filtered.filter((todo) => !todo.completed);
        break;
      case "completed":
        filtered = filtered.filter((todo) => todo.completed);
        break;
    }
    return filtered;
  });
  // 已完成数据
  const completedTodos = computed(() => {
    return todos.value.filter((todo) => todo.completed);
  });

  //全部标为已完成
  const completeAll = () => {
    todos.value.forEach((todo) => {
      todo.completed = true;
    });
  };
  //删除已完成
  const removeCompleted = () => {
    todos.value = todos.value.filter((todo) => !todo.completed);
  };
  //删除全部
  const removeAll = () => {
    todos.value = [];
  };
  //删除单个
  const removeTodo = (id) => {
    showMessageBox("确认删除该事项？").then(() => {
      todos.value = todos.value.filter((todo) => todo.id !== id);
    });
  };

  //获取浏览器指纹
  FingerprintJS.load().then((fp) => {
    // 2. 获取指纹
    fp.get().then((result) => {
      const visitorId = result.visitorId;
      // console.log(result);
      // console.log(visitorId); // 打印出用户的唯一 ID
      fingerprint.value = visitorId;
    });
  });

  return {
    todos,
    completedTodos,
    conditionFilter,
    intention,
    categorys,
    selectedCategory,
    fingerprint,
    token,
    userInfo,
    completeAll,
    removeCompleted,
    removeAll,
    removeTodo,
  };
});
