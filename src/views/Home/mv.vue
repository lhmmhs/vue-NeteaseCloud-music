<template>
  <div class="mvs">
    <h3>推荐MV</h3>
    <div class="mv-list"></div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { requestMvs } from "@/api";

export default {
  setup() {
    const mvs = ref([]);

    // methods
    const getMvs = async () => {
      let data = await requestMvs();
      // songs.value = result;
    };

    // lifecycle
    onMounted(getMvs);

    return {
      mvs,
    };
  },
};
</script>


<style lang="stylus" scoped>
.mvs
  margin-top: 50px
</style>