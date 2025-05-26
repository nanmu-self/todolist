<template>
  <Dialog
    ref="dialog"
    :title="isLogin ? t('LoginBox.title.login') : t('LoginBox.title.register')"
  >
    <template #content>
      <input
        type="text"
        class="custom-alert-input"
        v-model="fromData.email"
        :placeholder="t('LoginBox.form.email')"
        required
      />
      <input
        type="password"
        class="custom-alert-input"
        v-model="fromData.password"
        :placeholder="t('LoginBox.form.password')"
        required
      />
      <input
        v-if="isLogin"
        type="password"
        class="custom-alert-input"
        v-model="fromData.confirmPassword"
        :placeholder="t('LoginBox.form.confirmPassword')"
        required
      />
      <div style="display: flex; align-items: center">
        <input
          type="text"
          class="custom-alert-input"
          v-model="fromData.code"
          :placeholder="t('LoginBox.form.code')"
          required
          style="margin-right: 8px"
        />
        <img
          style="margin-left: 8px"
          :src="captchaImage"
          alt="验证码"
          @click="refreshCaptcha"
        />
      </div>

      <div style="display: flex; align-items: center" v-if="isLogin">
        <input
          type="text"
          class="custom-alert-input"
          v-model="fromData.emailCode"
          :placeholder="t('LoginBox.form.emailCode')"
          required
          style="margin-right: 8px; flex: 1"
        />
        <button
          class="custom-alert-btn code-btn"
          :disabled="emailIsCounting && emailCountDown > 0"
          @click="sendEmailCodeBtn"
        >
          {{
            emailIsCounting
              ? `${emailCountDown}s`
              : t("LoginBox.buttons.getVerificationCode")
          }}
        </button>
      </div>
    </template>
    <template #btn>
      <div class="custom-alert-buttons" style="justify-content: space-between">
        <button class="custom-alert-btn confirm" @click="isLogin = !isLogin">
          {{
            isLogin
              ? t("LoginBox.buttons.toggleMode.toLogin")
              : t("LoginBox.buttons.toggleMode.toRegister")
          }}
        </button>
        <div class="custom-alert-buttons">
          <button class="custom-alert-btn cancel" @click="dialog.switchShow()">
            {{ t("LoginBox.buttons.cancel") }}
          </button>
          <button class="custom-alert-btn confirm" @click="submit">
            {{
              isLogin
                ? t("LoginBox.buttons.submit.register")
                : t("LoginBox.buttons.submit.login")
            }}
          </button>
        </div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import Dialog from "@/common/Dialog.vue";
import { sendEmailCode, register, login } from "@/api/login.js";
import { ref, watch, computed } from "vue";
import { useDataStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";
import Message from  "@/common/Message/Message.js";
import md5 from "js-md5";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const store = useDataStore();
const { fingerprint, token, email } = storeToRefs(store);

const captchaImage = ref(import.meta.env.VITE_API_URL);
const isLogin = ref(false);
const emailCountDown = ref(60);
const emailIsCounting = ref(false);

const dialog = ref(null);
const fromData = ref({
  email: "",
  password: "",
  confirmPassword: "",
  code: "",
  emailCode: "", // 新增邮箱验证码字段
});

const switchShow = () => {
  dialog.value.switchShow();
  getCode("login");
};
//监听登录还是注册
watch(isLogin, (val) => {
  getCode(val ? "register" : "login");
});
// 刷新验证码
const refreshCaptcha = () => {
  getCode(isLogin.value ? "register" : "login");
};
// 获取验证码
const getCode = (scene) => {
  captchaImage.value =
    import.meta.env.VITE_API_URL +
    `/auth/getcode?uuid=${fingerprint.value}&scene=${scene}&_=${Date.now()}`;
};
// const rules ={
//     email: [
//       { required: true, message: "请输入邮箱", trigger: "blur" },
//       { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" },
//     ]
// }
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sendEmailCodeBtn = async () => {
  if (emailIsCounting.value) return;
  // 邮箱格式验证
  if (!fromData.value.email || !emailRegex.test(fromData.value.email)) {
    Message.error(t("LoginBox.validation.emailRequired"))// 修改: "😅请输入有效的邮箱地址!❓️"
    return;
  }
  if (!fromData.value.code) {
    Message.error(t("LoginBox.validation.codeRequired")); // 修改: "😅请输入验证码计算结果!❓️"
    return;
  }

  // 模拟发送验证码的请求
  console.log("发送邮箱验证码", fromData.value.email);
  // console.log(fingerprint.value);
  // console.log(fromData.value.code);
  // console.log(isLogin.value ? "register" : "login");

  await sendEmailCode({
    uuid: fingerprint.value,
    code: String(fromData.value.code),
    email: fromData.value.email,
    scene: isLogin.value ? "register" : "login",
  }).then((res) => {
    console.log(res);
    if (res.errCode != 0) {
      Message.success(res.errMsg)
    }
  });

 
  emailIsCounting.value = true;
  const timer = setInterval(() => {
    emailCountDown.value--;
    if (emailCountDown.value <= 0) {
      clearInterval(timer);
      emailIsCounting.value = false;
      emailCountDown.value = 60;
    }
  }, 1000);
};
//确认按钮，登录或者注册
const submit = async () => {
  // 邮箱格式验证

  if (!fromData.value.email || !emailRegex.test(fromData.value.email)) {
    Message.error(t("LoginBox.validation.emailFormat")); // 修改: "😅请输入有效的邮箱地址!❓️"
    return;
  }

  // 密码验证（至少6位）
  if (!fromData.value.password || fromData.value.password.length < 6) {
    Message.error(t("LoginBox.validation.passwordLength")); // 修改: "😅密码需至少6位字符!❓️"
    return;
  }

  // 注册时验证确认密码
  if (
    isLogin.value &&
    fromData.value.password !== fromData.value.confirmPassword
  ) {
    Message.error(t("LoginBox.validation.passwordMatch")); // 修改: "😅两次输入的密码不一致❓️"
    return;
  }

  // 验证码验证
  if (!fromData.value.code) {
    Message.error(t("LoginBox.validation.codeRequired")); // 修改: "😅请输入验证码计算结果!❓️"
    return;
  }

  // 邮箱验证码验证
  if (
    isLogin.value &&
    (!fromData.value.emailCode || fromData.value.emailCode.length !== 6)
  ) {
    Message.error(t("LoginBox.validation.emailCodeFormat")); // 修改: "😅请输入6位邮箱验证码!❓️"
    return;
  }
  let data = {
    uuid: fingerprint.value,
    scene: isLogin.value ? "register" : "login",
    ...fromData.value,
  };

  data.password = md5(fromData.value.password);
  // 通过验证后提交数据（示例）
  console.log("表单验证通过", fromData.value);
  if (isLogin.value) {
    await register(data).then((res) => {
      if (res.errCode == 0) {
        Message.success(t("LoginBox.messages.registerSuccess"));// 修改: "🎉注册成功!"
        token.value = res.data.token;
        email.value = res.data.email;
        dialog.value.switchShow();
      } else {
        Message.error(res.errMsg)

      }
    });
  } else {
    await login(data).then((res) => {
      if (res.errCode == 0) {
        Message.success(t("LoginBox.messages.loginSuccess")); // 修改: "🎉登录成功!"
        token.value = res.data.token;
        email.value = res.data.email;
        dialog.value.switchShow();
        location.reload();
      } else {
        Message.error(res.errMsg)
      }
    });
  }
};
defineExpose({
  switchShow,
});
</script>
<style>
/* 添加基础样式 */
.custom-alert-input {
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  box-sizing: border-box;
  cursor: text;
}
</style>
