<template>
  <div class="custom-alert-overlay" v-if="show">
    <div class="custom-alert">
      <!-- 添加具名插槽 header -->

      <div class="custom-alert-title">
        {{ title }}
      </div>

      <div class="custom-alert-content">
        <slot name="content"> </slot>
      </div>
      <slot name="btn">
        <div class="custom-alert-buttons">
          <button class="custom-alert-btn cancel" @click="switchShow">
            取消
          </button>
          <button class="custom-alert-btn confirm" @click="submit">确定</button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// 接收父组件传进来的 props
const props = defineProps({
  title: {
    type: String,
    default: "请确认",
  },
});

const show = ref(false);

const switchShow = () => {
  show.value = !show.value;
};

const submit = () => {};

// 导出 switchShow 方法供父组件调用
defineExpose({
  switchShow,
});
</script>

<style scoped></style>
