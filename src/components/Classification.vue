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
        :key="category._id"
        type="button"
        :data-id="category._id"
        class="btn btn-label btn-allFinish btn-category"
        :value="category.title"
        :class="{ action: selectedCategory == category._id }"
        @click="selectedCategory = category._id"
      />
    </div>
  </ContextMenu>
  <Dialog
    ref="dialog"
    :title="fromData.categoryId ? '修改分类' : '添加分类'"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <template #content>
      <input
        type="text"
        class="custom-alert-input"
        v-model="fromData.title"
        placeholder="分类名"
        ref="inputEl"
      />
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from "@/common/Dialog.vue";
import { showMessageBox } from "@/utils/MessageBox.js";
import { del, get, update, create } from "@/api/classification";
import ContextMenu from "@/common/ContextMenu/ContextMenu.vue";
import { useDataStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";
import { ref, onMounted, nextTick } from "vue";

const store = useDataStore();
const { categorys, selectedCategory } = storeToRefs(store);
const inputEl = ref(null);
onMounted(() => {
  getMenu();
});

const getMenu = () => {
  get().then((res) => {
    categorys.value = res.data.list;
  });
};

const dialog = ref(null);
const fromData = ref({
  categoryId: "",
  title: "",
  sort: "",
});
const handleClose = () => {
  fromData.value = {
    categoryId: "",
    title: "",
    sort: "",
  };
};
// 弹窗确认
const handleConfirm = () => {
  if (fromData.value.categoryId) {
    update(fromData.value).then((res) => {
      if (res.errCode == 0) {
        showMessageBox("🎉修改成功!", "成功");
      } else {
        showMessageBox(" 😅修改失败!", "失败");
      }
    });
  } else {
    create(fromData.value).then((res) => {
      if (res.errCode == 0) {
        showMessageBox("🎉添加成功!", "成功");
      } else {
        showMessageBox(" 😅添加失败!", "失败");
      }
    });
  }
  dialog.value.switchShow();
  getMenu();
};
//右键
const handleContextMenu = (menuItem, element) => {
  console.log("右键元素:", element.value); // 获取右键点击的 DOM 元素
  console.log(menuItem);
  switch (menuItem.label) {
    case "添加":
      dialog.value.switchShow();

      break;
    case "修改":
      dialog.value.switchShow();
      fromData.value.title = categorys.value.find(
        (item) => item._id === element.value
      ).title;
      fromData.value.categoryId = element.value;

      break;
    case "删除":
      fromData.value.categoryId = element.value;
      showMessageBox("确认删除吗？", "提示").then(() => {
        del(fromData.value).then((res) => {
          if (res.errCode == 0) {
            getMenu();
          }
        });
      });
      break;
  }
  nextTick(() => {
    if (inputEl.value) inputEl.value.focus();
  });
};
</script>
