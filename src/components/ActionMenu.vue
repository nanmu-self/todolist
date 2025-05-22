<script setup>
import { batchUpdateTodo } from "@/api/todo.js";
import { ref, computed } from "vue";
import { useDataStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";
import { showMessageBox } from "@/common/MessageBox/MessageBox.js";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const store = useDataStore();
const { intention, todos } = storeToRefs(store);
const isShow = ref(true);

const shortCutAction = () => {
  isShow.value = !isShow.value;
};
//一键完成代办事项
const markAllAsCompleted = () => {
  // 实现标记全部完成的逻辑

  showMessageBox(t("ActionMenu.confirmCheckAllDone")).then(async () => {
    // todos.value.forEach((todo) => {
    //   todo.completed = true;
    // });
    let res = await batchUpdateTodo({
      ids: todos.value
        .filter((todo) => !todo.completed) // 过滤掉 completed 为 true 的项
        .map((todo) => todo._id),
    });
    console.log(res);
  });
};

const clearCompleted = () => {
  // 实现清除已完成的逻辑

  showMessageBox(t("ActionMenu.confirmClearAllCompleted")).then(() => {
    todos.value = todos.value.filter((todo) => !todo.completed);
  });
};

const clearAll = () => {
  console.log("Clearing all todos");
  // 实现清除全部的逻辑
  showMessageBox(t("ActionMenu.confirmClearAllPending")).then(() => {
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
    value: t("ActionMenu.all"),
    class: "btn-small action-showAll",
    action: () => (intention.value = "all"),
    condition: true, // 总是显示
    isSelected: intention.value === "all",
    key: "all", // 为 v-for 提供 key
  },
  {
    value: t("ActionMenu.inProgress"),
    class: "btn-small action-progress",
    action: () => (intention.value = "ongoing"),
    condition: todos.value.some((todo) => !todo.completed), // 当有未完成待办时显示
    isSelected: intention.value === "ongoing",
    key: "ongoing",
  },
  {
    value: t("ActionMenu.completed"),
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
    value: t("ActionMenu.markAllAsDone"),
    class: "btn-small completed-all",
    action: markAllAsCompleted,
    condition: todos.value.some((todo) => !todo.completed), // 当有未完成待办时显示
    isSelected: false, // 非过滤按钮，无选中状态
    key: "markAll",
  },
  {
    value: t("ActionMenu.clearCompleted"),
    class: "btn-small completed-clear",
    action: clearCompleted,
    condition: todos.value.filter((todo) => todo.completed).length > 0, // 当有已完成待办时显示
    isSelected: false, // 非过滤按钮，无选中状态
    key: "clearCompleted",
  },
  {
    value: t("ActionMenu.clearAll"),
    class: "btn-small clear-all",
    action: clearAll,
    condition: todos.value.length > 0,
    isSelected: false, // 非过滤按钮，无选中状态
    key: "clearAll",
  },
  {
    value: t("ActionMenu.exportData"),
    class: "btn-small action-download",
    action: handleClickDownload,
    condition: todos.value > 0,
    isSelected: false,
    key: "download",
  },
  {
    value: t("ActionMenu.import"),
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
        <span class="shortcut-title">{{ t("ActionMenu.open") }}✨</span>
        <span class="shortcut-name">{{ t("ActionMenu.quickActions") }}</span>
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
