<template>
  <layout />
</template>

<script>
import layout from "@/views/layout";
import { requestLoginStatus } from "@/api";
import { useStore } from "vuex";

export default {
  components: { layout },
  setup() {
    const store = useStore();

    const getLoginStatus = async () => {
      const { code, profile } = await requestLoginStatus();

      if (code === 200) {
        store.commit("user/setProfile", profile);
        store.commit("user/setStatus", true);
      }
    };

    getLoginStatus();
  },
};
</script>

