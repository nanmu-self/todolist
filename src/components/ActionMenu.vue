<script setup>
import { ref } from "vue";
const isShow = ref(true);
const shortCutAction = () => {
  isShow.value = !isShow.value;
};
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
        <li>
          <input
            class="btn-small action-showAll"
            type="button"
            value="全部"
            :class="{ selected: intention === 'all' }"
            @click="intention = 'all'"
          />
        </li>
        <li v-if="completedTodosCount">
          <input
            class="btn-small action-progress"
            type="button"
            value="进行中"
            v-if="leftTodosCount"
            :class="{ selected: intention === 'ongoing' }"
            @click="intention = 'ongoing'"
          />
        </li>
        <li v-if="completedTodosCount">
          <input
            class="btn-small action-completed"
            type="button"
            value="已完成"
            v-if="completedTodosCount"
            :class="{ selected: intention === 'completed' }"
            @click="intention = 'completed'"
          />
        </li>
      </ul>
      <ul class="todo-func-list batch">
        <li v-if="leftTodosCount">
          <input
            type="button"
            class="btn-small completed-all"
            v-if="leftTodosCount"
            value="全部标为已完成"
            @click="markAllAsCompleted"
          />
        </li>
        <li v-if="completedTodosCount">
          <input
            type="button"
            value="清除已完成"
            class="btn-small completed-clear"
            v-if="completedTodosCount"
            @click="clearCompleted"
          />
        </li>
        <li>
          <input
            type="button"
            class="btn-small clear-all"
            value="清除全部"
            @click="clearAll"
          />
        </li>
      </ul>
      <ul class="todo-func-list datasave">
        <li v-if="leftTodosCount">
          <input
            type="button"
            value="导出数据"
            class="btn-small action-download"
            id="download"
            @click="handleClickDownload()"
          />
        </li>
        <li>
          <input
            value="导入(txt/json)"
            type="button"
            class="btn-small action-import"
            id="import"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
