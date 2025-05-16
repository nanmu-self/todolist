<script setup>
import { ref, computed } from "vue";
import { useDataStore } from "../stores/userStore.js";
import { storeToRefs } from "pinia";
import { showMessageBox } from "@/utils/MessageBox.js";

const store = useDataStore();
const { intention, todos } = storeToRefs(store);
const isShow = ref(true);

const shortCutAction = () => {
  isShow.value = !isShow.value;
};

const markAllAsCompleted = () => {
  console.log("Marking all as completed");
  // 实现标记全部完成的逻辑

  showMessageBox("确认一键勾选完成全部待办事项？").then(() => {
    todos.value.forEach((todo) => {
      todo.completed = true;
    });
  });
};

const clearCompleted = () => {
  console.log("Clearing completed todos");
  // 实现清除已完成的逻辑

  showMessageBox("确认清除全部已完成的代办事项?").then(() => {
    todos.value = todos.value.filter((todo) => !todo.completed);
  });
};

const clearAll = () => {
  console.log("Clearing all todos");
  // 实现清除全部的逻辑
  showMessageBox("确认清除全部待办事项?").then(() => {
    todos.value = [];
  });
};

const handleClickDownload = () => {
  console.log("Downloading data");
  // 实现导出数据的逻辑
};

const triggerImport = () => {
  console.log("Triggering import");
  // 实现触发文件选择或导入的逻辑
};

// 定义按钮数据数组
const buttonItems = computed(() => [
  {
    value: "全部",
    class: "btn-small action-showAll",
    action: () => (intention.value = "all"),
    condition: true, // 总是显示
    isSelected: intention.value === "all",
    key: "all", // 为 v-for 提供 key
  },
  {
    value: "进行中",
    class: "btn-small action-progress",
    action: () => (intention.value = "ongoing"),
    condition: todos.value.some((todo) => !todo.completed), // 当有未完成待办时显示
    isSelected: intention.value === "ongoing",
    key: "ongoing",
  },
  {
    value: "已完成",
    class: "btn-small action-completed",
    action: () => (intention.value = "completed"),
    condition: todos.value.some((todo) => todo.completed), // 当有已完成待办时显示
    isSelected: intention.value === "completed",
    key: "completed",
  },
  // {
  //   value: "回收站",
  //   class: "btn-small action-completed",
  //   action: () => (intention.value = "completed"),
  //   condition: todos.value.some((todo) => todo.completed), // 当有已完成待办时显示
  //   isSelected: intention.value === "completed",
  //   key: "removed",
  // },
  {
    value: "全部标为已完成",
    class: "btn-small completed-all",
    action: markAllAsCompleted,
    condition: todos.value.some((todo) => !todo.completed), // 当有未完成待办时显示
    isSelected: false, // 非过滤按钮，无选中状态
    key: "markAll",
  },
  {
    value: "清除已完成",
    class: "btn-small completed-clear",
    action: clearCompleted,
    condition: todos.value.filter((todo) => todo.completed).length > 0, // 当有已完成待办时显示
    isSelected: false, // 非过滤按钮，无选中状态
    key: "clearCompleted",
  },
  {
    value: "清除全部",
    class: "btn-small clear-all",
    action: clearAll,
    condition: todos.value.length > 0,
    isSelected: false, // 非过滤按钮，无选中状态
    key: "clearAll",
  },
  {
    value: "导出数据",
    class: "btn-small action-download",
    action: handleClickDownload,
    condition: todos.value > 0,
    isSelected: false,
    key: "download",
  },
  {
    value: "导入(txt/json)",
    class: "btn-small action-import",
    // 原始代码无 @click，这里假设有一个触发导入的函数
    action: triggerImport,
    condition: true, // 总是显示
    isSelected: false,
    key: "import",
  },
]);
</script>

<template>
  <div class="footer side-bar">
    <div
      class="side-shortcut"
      @click="shortCutAction"
      :class="{ fold: isShow }"
    >
      <div class="shortcut-switch">
        <span class="shortcut-title">开✨</span>
        <span class="shortcut-name">快捷操作 </span>
      </div>
    </div>
    <div class="todo-footer-box">
      <ul class="todo-func-list filter">
        <template v-for="item in buttonItems" :key="item.key">
          <li v-if="item.condition">
            <input
              type="button"
              :class="[item.class, { selected: item.isSelected }]"
              :value="item.value"
              @click="item.action"
              :id="item.key === 'import' ? 'import' : null"
            />
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
