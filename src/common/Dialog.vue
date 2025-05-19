<template>
  <div class="custom-alert-overlay" v-if="show">
    <div class="custom-alert">
      <!-- 添加具名插槽 header -->

      <div class="custom-alert-title">
        {{ title ? title : t("Dialog.confirmCarefully") }}
      </div>

      <div class="custom-alert-content">
        <slot name="content"> </slot>
      </div>
      <slot name="btn">
        <div class="custom-alert-buttons">
          <button class="custom-alert-btn cancel" @click="switchShow">
            {{ t("Dialog.cancel") }}
          </button>
          <button class="custom-alert-btn confirm" @click="submit">
            {{ t("Dialog.confirm") }}
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
// 接收父组件传进来的 props
const props = defineProps({
  title: {
    type: String,
  },
});
console.log(props);
const show = ref(false);

const switchShow = () => {
  show.value = !show.value;
  emit("close");
};

const submit = () => {
  emit("confirm");
};
const emit = defineEmits(["confirm", "close"]);

// 导出 switchShow 方法供父组件调用
defineExpose({
  switchShow,
});
</script>

<style scoped></style>
