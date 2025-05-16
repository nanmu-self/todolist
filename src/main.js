import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import "./style.css";
import { createPinia } from "pinia";

import App from "./App.vue";

// 导入语言文件
import en from "./locales/en.json";
import zh from "./locales/zh.json";

const i18n = createI18n({
  legacy: false, // 使用组合式 API
  locale: "zh", // 设置默认语言
  fallbackLocale: "en", // 设置备用语言
  messages: {
    en,
    zh,
  },
});
export { i18n }; //导出 i18n 实例供外部使用
const app = createApp(App);
app.use(createPinia());
app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});
app.use(i18n);
app.mount("#app");
