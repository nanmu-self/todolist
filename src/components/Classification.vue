<template>
  <ContextMenu @select="(item, element) => handleContextMenu(item, element)">
    <div class="bar-message" style="background-color: var(--bg-normal)">
      <input
        type="button"
        class="btn btn-label btn-allFinish"
        :value="t('Category.all')"
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
    :title="fromData.categoryId ? t('Category.modify') : t('Category.add')"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <template #content>
      <input
        type="text"
        class="custom-alert-input"
        v-model="fromData.title"
        :placeholder="t('Category.placeholder.title')"
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

import { useI18n } from "vue-i18n";
const { t } = useI18n();

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
        showMessageBox(t("Category.success.update"), t("Category.successful"));
      } else {
        showMessageBox(t("Category.error.update"), t("Category.failure"));
      }
    });
  } else {
    create(fromData.value).then((res) => {
      if (res.errCode == 0) {
        showMessageBox(t("Category.success.create"), t("Category.successful"));
      } else {
        showMessageBox(t("Category.error.create"), t("Category.failure"));
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
  switch (menuItem.id) {
    case 1:
      dialog.value.switchShow();

      break;
    case 2:
      dialog.value.switchShow();
      fromData.value.title = categorys.value.find(
        (item) => item._id === element.value
      ).title;
      fromData.value.categoryId = element.value;

      break;
    case 3:
      fromData.value.categoryId = element.value;
      showMessageBox(t("Category.confirmDelete")).then(() => {
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
