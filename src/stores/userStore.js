import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDataStore = defineStore("userdata", () => {
  const intention = ref("all");
  const selectedCategory = ref(0); //分类
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
    todos.value = todos.value.filter((todo) => todo.id !== id);
  };

  return {
    todos,
    completedTodos,
    conditionFilter,
    intention,
    categorys,
    selectedCategory,
    completeAll,
    removeCompleted,
    removeAll,
    removeTodo,
  };
});
