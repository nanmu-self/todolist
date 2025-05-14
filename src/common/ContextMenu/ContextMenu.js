import { onMounted, ref, onUnmounted } from "vue";

export default function (containerRef) {
  // 右键菜单的显示状态
  const contextMenuVisible = ref(false);
  const contextMenuPosition = ref({ x: 0, y: 0 });
  const clickedElementID = ref(null); // 新增：存储右键点击的元素

  const showContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    contextMenuPosition.value.x = event.clientX;
    contextMenuPosition.value.y = event.clientY;
    clickedElementID.value = event.target.dataset.id; // 保存右键点击的元素
    contextMenuVisible.value = true;
  };

  const hideContextMenu = () => {
    contextMenuVisible.value = false;
  };

  onMounted(() => {
    const div = containerRef.value;
    div.addEventListener("contextmenu", showContextMenu);
    window.addEventListener("click", hideContextMenu, true);
    window.addEventListener("contextmenu", hideContextMenu, true);
  });

  onUnmounted(() => {
    const div = containerRef.value;
    div.removeEventListener("contextmenu", showContextMenu);
    window.removeEventListener("click", hideContextMenu, true);
    window.removeEventListener("contextmenu", hideContextMenu, true);
  });

  return {
    contextMenuVisible,
    contextMenuPosition,
    clickedElementID,
  };
}
