<template>
  <layout />
</template>

<script>
import layout from "@/views/Layout";
import { requestLoginStatus } from "@/api";
import { useStore } from "vuex";

export default {
  components: { layout },
  setup() {
    const store = useStore();

    const getLoginStatus = async () => {
      console.log(navigator.userAgent);
      // mac
      const {
        data: { code, profile },
      } = await requestLoginStatus();

      // win
      // const { code, profile } = await requestLoginStatus();

      if (code === 200) {
        store.commit("user/setProfile", profile);
        store.commit("user/setStatus", true);
      }
    };

    getLoginStatus();
  },
};
</script>

