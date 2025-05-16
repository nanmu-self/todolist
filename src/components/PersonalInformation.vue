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
      <a class="en" draggable="false" @click="saveLanguage('en')">En</a>
      <span>/</span>
      <a target="_self" class="zh active" draggable="false">中</a>
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
      {{ email ? email : "登录" }}
      <span v-if="email">退出登录</span>
    </div>
  </div>

  <LoginBox ref="loginBox" />
</template>
<script setup>
import { ref } from "vue";
import LoginBox from "@/components/LoginBox.vue";
import { showMessageBox } from "@/utils/MessageBox.js";
import { useDataStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";

const store = useDataStore();
const { email, token } = storeToRefs(store);
const loginBox = ref(null);
const loginBtn = () => {
  if (email.value) {
    showMessageBox("是否退出登录?", "请确认").then(() => {
      email.value = "";
      token.value = "";
    });
  } else {
    loginBox.value.switchShow();
  }
};
</script>
