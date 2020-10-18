<template>
  <div class="login">
    <input class="account" v-model="phone" type="text" placeholder="手机号" />
    <input class="password" v-model="password" type="password" placeholder="密码" />
    <button class="login-btn" @click="login">登陆</button>
  </div>
</template>

<script>
import { requestLoginCellphone } from "@/api";
import { requestBanner, requestSongDetail } from "@/api";
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();

    const phone = ref("");
    const password = ref("");

    const login = async () => {
      let pass = encodeURIComponent(password.value);
      const { cookie, profile, code } = await requestLoginCellphone(phone.value, pass);

      if (code === 200) {
        localStorage.setItem("profile", JSON.stringify(profile));
      } else if (code === 502) {
        // 密码错误
      } else if (code === 400) {
        // 1.账号未注册
      }
    };

    return {
      login,

      phone,
      password,
    };
  },
};
</script>

<style lang="stylus" scoped>
.login
  margin: 20px 40px
.account, .password
  display: block
  height: 19px
  width: 200px
  padding: 5px 6px 6px
  border: 1px solid #cdcdcd
  border-radius: 2px
  line-height: 19px
  box-sizing: content-box
  margin-bottom: 10px
.login-btn
  display: block
  height: 19px
  width: 200px
  padding: 5px 6px 6px
  border-radius: 2px
  line-height: 19px
  box-sizing: content-box
  background: #ff4d4f
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)
  color: #fff
  &:active
    background: #d9363e
</style>