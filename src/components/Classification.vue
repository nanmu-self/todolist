<template>
  <ContextMenu @select="(item, element) => handleContextMenu(item, element)">
    <div class="bar-message" style="background-color: var(--bg-normal)">
      <input
        type="button"
        class="btn btn-label btn-allFinish"
        value="全部"
        :class="{ action: selectedCategory == 0 }"
        @click="selectedCategory = 0"
      />
      <input
        v-for="category in categorys"
        :key="category.id"
        type="button"
        :data-id="category.id"
        class="btn btn-label btn-allFinish btn-category"
        :value="category.title"
        :class="{ action: selectedCategory == category.id }"
        @click="selectedCategory = category.id"
      />
    </div>
  </ContextMenu>
</template>

<script setup>
import Dialog from "@/common/Dialog.vue";
import ContextMenu from "@/common/ContextMenu/ContextMenu.vue";
import { useDataStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";

const store = useDataStore();
const { categorys, selectedCategory } = storeToRefs(store);
//右键
const handleContextMenu = (menuItem, element) => {
  console.log("右键元素:", element.value); // 获取右键点击的 DOM 元素
  console.log(menuItem);
  // switch (menuItem.label) {
  //   case "添加":
  //     addTodo();
  //     break;
  //   case "修改":
  //     // 通过 DOM 元素定位数据（例如：element.dataset.id）
  //     const todoId = element.dataset.id;
  //     const todo = todos.value.find((t) => t.id === parseInt(todoId));
  //     if (todo) editdTodo(todo);
  //     break;
  //   case "删除":
  //     const deleteId = element.dataset.id;
  //     store.removeTodo(deleteId);
  //     break;
  // }
};
</script>
