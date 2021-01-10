<template>
  <div class="login-wrap" v-if="$store.state.login">
    <div class="login">
      <div class="login-row">
        <input class="account" v-model="phone" type="text" placeholder="手机号" />
      </div>
      <div class="login-row">
        <input class="password" v-model="password" type="text" placeholder="密码" />
      </div>
      <div class="login-row">
        <button class="login-btn" @click="login">登录</button>
      </div>
      <div class="login-row">
        <button class="close-btn" @click="$store.commit('setLogin', false)">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, ref } from "vue";
import { requestLoginCellphone } from "@/api";
import message from "@/components/message-box";

export default {
  setup() {
    const phone = ref("");
    const password = ref("");

    const login = async () => {
      if (phone.value === "") {
        return message({
          title: "提示",
          message: "请填写手机号",
        });
      } else if (password.value === "") {
        return message({
          title: "提示",
          message: "请填写密码",
        });
      }

      let pass = encodeURIComponent(password.value);
      const { profile, code } = await requestLoginCellphone(phone.value, pass);

      console.log(profile, code);

      if (code === 200) {
        store.commit("user/setProfile", profile);
        store.commit("user/setStatus", true);
        store.commit("setLogin", false);
      } else if (code === 502) {
        // 密码错误
        message({
          title: "提示",
          message: "密码错误",
        });
      } else if (code === 400) {
        // 密码错误
        message({
          title: "提示",
          message: "该账号未注册",
        });
      }
    };

    return {
      phone,
      password,
      login,
    };
  },
};
</script>

<style lang="stylus" scoped>
.login-wrap
  display: flex
  justify-content: center
  align-items: center
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  z-index: 10
  background: rgba(0, 0, 0, 0.5)
.login
  width: 220px
  background: #fff
  padding: 20px
.login-row
  margin-bottom: 10px
.account, .password
  height: 32px
  line-height: 32px
  width: 100%
  padding: 0 10px 0
  border: 1px solid #cdcdcd
  border-radius: 2px
  box-sizing: border-box
.login-btn, .close-btn
  display: block
  height: 32px
  width: 220px
  padding: 0 6px 0
  border-radius: 2px
  line-height: 32px
  box-sizing: content-box
  background: #ff4d4f
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)
  color: #fff
  box-sizing: border-box
  &:active
    background: #d9363e
</style>