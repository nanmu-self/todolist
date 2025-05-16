import { defineStore } from "pinia";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { ref, computed, watch } from "vue";
import { showMessageBox } from "@/utils/MessageBox.js";
import { get } from "@/api/todo.js";
export const useDataStore = defineStore("userdata", () => {
  const intention = ref("all");
  const selectedCategory = ref(0); //分类
  const fingerprint = ref(""); //用户指纹
  const token = ref(localStorage.getItem("token") || "");
  const email = ref(localStorage.getItem("email") || "");
  const pagedData = ref({
    currentPage: 1,
    totalPages: 0,
  });
  const categorys = ref([
    // {
    //   _id: 1,
    //   title: "工作",
    // },
    // {
    //   _id: 2,
    //   title: "生活",
    // },
    // {
    //   _id: 3,
    //   title: "学习",
    // },
  ]);
  const todos = ref([
    // {
    //   _id: 1,
    //   title: "Buy groceries",
    //   completed: false,
    //   category: 1,
    // },
    // {
    //   _id: 2,
    //   title: "Clean the house",
    //   completed: true,
    //   category: 2,
    // },
    // {
    //   _id: 3,
    //   title: "学习英语",
    //   completed: true,
    //   category: 3,
    // },
    // {
    //   _id: 4,
    //   title: "学习英语",
    //   completed: true,
    //   category: 3,
    // },
    // {
    //   _id: 5,
    //   title: "学习英语",
    //   completed: true,
    //   category: 3,
    // },
  ]);
  //获取分类
  const getTodo = () => {
    let params = {
      currentPage: pagedData.value.currentPage,
    };
    if (selectedCategory.value !== 0) {
      params.categoryId = selectedCategory.value;
    }
    get(params).then((res) => {
      if (res.errCode === 0) {
        todos.value = res.data;
        pagedData.value = res.pagination;
      } else {
        showMessageBox("获取数据失败", "失败");
      }
    });
  };
  //持久化存储token
  watch(token, (newVal) => {
    localStorage.setItem("token", newVal);
  });
  //持久化存储userInfo
  watch(email, (newVal) => {
    localStorage.setItem("email", newVal);
  });
  watch(
    selectedCategory,
    (newVal) => {
      pagedData.value.currentPage = 1; // 重置当前页码
      getTodo();
    },
    { immediate: true }
  );

  //分页
  const changePage = (page) => {
    pagedData.value.currentPage = page;
    console.log(pagedData.value);
    getTodo();
  };
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
    email,
    pagedData,
    completeAll,
    removeCompleted,
    removeAll,
    removeTodo,
    changePage,
    getTodo,
  };
});
