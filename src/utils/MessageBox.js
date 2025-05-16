import { createVNode, render } from "vue";
import MessageBox from "@/common/MessageBox.vue";
import { i18n } from "@/main.js";
export function showMessageBox(message, title) {
  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    title = title || i18n.global.t("MessageBox.title");
    const vnode = createVNode(MessageBox, {
      message,
      title,
      confirmText: i18n.global.t("MessageBox.confirm"),
      cancelText: i18n.global.t("MessageBox.cancel"),
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
