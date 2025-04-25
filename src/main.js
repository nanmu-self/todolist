import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import "./style.css";
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

const app = createApp(App);
app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});
app.use(i18n);
app.mount("#app");
