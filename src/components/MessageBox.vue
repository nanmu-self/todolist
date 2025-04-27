<template>
  <div class="custom-alert-overlay">
    <div class="custom-alert">
      <div class="custom-alert-title">请确认</div>
      <div class="custom-alert-content">{{ message }}</div>
      <div class="custom-alert-buttons">
        <button class="custom-alert-btn cancel" @click="handleCancel">
          取消
        </button>
        <button class="custom-alert-btn confirm" @click="handleConfirm">
          确定
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
// 接收父组件传进来的 props
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  onConfirm: {
    type: Function,
    required: true,
  },
  onCancel: {
    type: Function,
    required: true,
  },
});

// 点击按钮
function handleConfirm() {
  props.onConfirm();
}
function handleCancel() {
  props.onCancel();
}
</script>
