<template>
  <!-- 自定义个人的信息 -->
  <div class="nav" draggable="false">
    <div class="github">
      <a
        href="https://github.com/nanmu-self/todolist"
        target="_blank"
        class="social-link"
        draggable="false"
      >
        <img
          src="@/assets/img/github.svg"
          class="ic-social"
          alt=""
          draggable="false"
        />
      </a>
    </div>

    <!-- 根据需要切换中英文作为首页 -->
    <div class="language switch-language">
      <a
        class="en"
        draggable="false"
        @click="saveLanguage('en')"
        :class="{ active: locale == 'en' }"
        >En</a
      >
      <span>/</span>
      <a
        target="_self"
        class="zh"
        :class="{ active: locale == 'zh' }"
        draggable="false"
        @click="saveLanguage('zh')"
        >中</a
      >
    </div>
    <div
      style="
        font-size: 0.8rem;
        font-weight: 900;
        margin-left: 1rem;
        cursor: pointer;
      "
      @click="loginBtn"
    >
      {{ email ? email : t("PersonalInformation.login") }}
      <span v-if="email">{{ t("PersonalInformation.logout") }}</span>
    </div>
  </div>

  <LoginBox ref="loginBox" />
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import LoginBox from "@/components/LoginBox.vue";
import { showMessageBox } from "@/common/MessageBox/MessageBox.js";
import { useDataStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";

const store = useDataStore();
const { email, token } = storeToRefs(store);
const loginBox = ref(null);
const { locale, t } = useI18n();
const saveLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem("language", lang);
};
onMounted(() => {
  saveLanguage(localStorage.getItem("language") || "zh");
});
const loginBtn = () => {
  if (email.value) {
    showMessageBox(
      t("PersonalInformation.confirmLogout"),
      t("PersonalInformation.confirm")
    ).then(() => {
      email.value = "";
      token.value = "";
      location.reload()
    });
  } else {
    loginBox.value.switchShow();
  }
};
</script>
<style>
.language a {
  cursor: pointer;
}
</style>
