<template>
  <div class="custom-alert-overlay">
    <div class="custom-alert">
      <div class="custom-alert-title">
        {{ title }}
      </div>
      <div
        class="custom-alert-content"
        style="font-size: 18px; font-weight: 500"
      >
        {{ message }}
      </div>
      <div class="custom-alert-buttons">
        <button class="custom-alert-btn cancel" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="custom-alert-btn confirm" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
// 接收父组件传进来的 props
const props = defineProps({
  title: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  onConfirm: {
    type: Function,
  },
  onCancel: {
    type: Function,
  },
  confirmText: {
    type: String,
  },
  cancelText: {
    type: String,
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
