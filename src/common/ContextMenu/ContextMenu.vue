<template>
  <div class="container" ref="containerRef">
    <slot></slot>
    <teleport
      to="body"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
    >
      <div
        class="context-menu"
        v-if="contextMenuVisible"
        :style="{
          left: contextMenuPosition.x + 'px',
          top: contextMenuPosition.y + 'px',
        }"
      >
        <template v-for="(item, i) in menu" :key="i">
          <div
            v-if="clickedElementID || item.label == '添加'"
            class="menu-item"
            @click="handleClick(item)"
          >
            <div class="icon">{{ item.icon }}</div>
            <div class="label">{{ item.label }}</div>
            <div class="shortcut">{{ item.shortcut }}</div>
          </div>
        </template>
      </div>
    </teleport>
  </div>
</template>
<script setup>
import { ref } from "vue";
import useContextMenu from "./ContextMenu";
const menu = ref([
  { icon: "🌱", label: "添加" },
  { icon: "🦋", label: "修改" },
  { icon: "🍂", label: "删除" },
]);
const containerRef = ref(null);
const emit = defineEmits(["select"]);
const { contextMenuVisible, contextMenuPosition, clickedElementID } =
  useContextMenu(containerRef);
const handleClick = (item) => {
  contextMenuVisible.value = false;
  emit("select", item, clickedElementID);
};
const beforeEnter = (el) => {
  el.style.height = 0;
};
const enter = (el) => {
  el.style.height = "auto";
  const h = el.clienHeight;
  el.style.height = 0;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.height = h + "px";
      el.style.transition = "0.5s";
    });
  });
};
const afterEnter = (el) => {
  el.style.transition = "none";
};
</script>
<style>
.context-menu {
  padding: 10px;
  position: fixed;
  width: fit-content;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
  /* display: none; */
  transform-origin: top left;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.menu-item {
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  position: relative;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

.menu-item:active {
  background-color: #e0e0e0;
}

.menu-item .icon {
  margin-right: 10px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
}

.menu-item .label {
  flex-grow: 1;
}

.menu-item .shortcut {
  color: #999;
  font-size: 0.8em;
}

.separator {
  height: 1px;
  background-color: #eee;
  margin: 5px 0;
}

.menu-item.has-submenu::after {
  content: "›";
  margin-left: 10px;
  color: #999;
}

.submenu {
  position: absolute;
  left: 100%;
  top: 0;
  width: 200px;
  background-color: white;
  border-radius: 0 8px 8px 8px;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.15);
  display: none;
}

.menu-item:hover > .submenu {
  display: block;
}

/* 主题颜色变体 */
.context-menu.dark {
  background-color: #2d3748;
  color: #f8f9fa;
}

.context-menu.dark .menu-item:hover {
  background-color: #4a5568;
}

.context-menu.dark .menu-item:active {
  background-color: #1a202c;
}

.context-menu.dark .separator {
  background-color: #4a5568;
}

.context-menu.dark .menu-item .icon {
  color: #a0aec0;
}

.context-menu.dark .menu-item .shortcut {
  color: #a0aec0;
}

/* 提示文本 */
.hint {
  text-align: center;
  color: #666;
  margin-top: 20px;
}
</style>
