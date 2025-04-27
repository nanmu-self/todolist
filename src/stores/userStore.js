import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDataStore = defineStore("userdata", () => {
  const intention = ref("all");
  const todos = ref([
    {
      id: 1,
      title: "Buy groceries",
      completed: false,
    },
    {
      id: 2,
      title: "Clean the house",
      completed: true,
    },
  ]);
  //条件筛选
  const conditionFilter = computed(() => {
    switch (intention.value) {
      case "all":
        return todos.value;
      case "ongoing":
        return todos.value.filter((todo) => !todo.completed);
      case "completed":
        return todos.value.filter((todo) => todo.completed);
    }
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
    completeAll,
    removeCompleted,
    removeAll,
    removeTodo,
  };
});
