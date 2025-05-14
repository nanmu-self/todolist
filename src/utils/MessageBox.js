import { createVNode, render } from "vue";
import MessageBox from "@/common/MessageBox.vue";

export function showMessageBox(message, title) {
  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const vnode = createVNode(MessageBox, {
      message,
      title,
      onConfirm: () => {
        render(null, container);
        document.body.removeChild(container);
        resolve("confirm");
      },
      onCancel: () => {
        render(null, container);
        document.body.removeChild(container);
        reject("cancel"); // 点了取消
      },
    });

    render(vnode, container);
  });
}
