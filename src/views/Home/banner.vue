<template>
  <div>banner</div>
</template>

<script>
import { reactive, ref } from "vue";
import { requestBanner } from "@/api";

export default {
  setup() {
    const banners = ref([]);

    return {
      banners,
    };
  },
};
</script>


<style lang="stylus" scoped></style>