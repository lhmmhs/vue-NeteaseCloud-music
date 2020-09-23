<template>
  <div class="mvs">
    <h3>推荐MV</h3>
    <div class="list">
      <mv-card v-bind="nomalizeMv(mv)" v-for="mv in mvs" :key="mv.id" />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { requestMvs } from "@/api";
import mvCard from "@/components/mv-card";
import { nomalizeMv } from "@/utils";

export default {
  components: { mvCard },
  setup() {
    const mvs = ref([]);

    // methods
    const getMvs = async () => {
      let { result } = await requestMvs();
      mvs.value = result;
    };

    // lifecycle
    onMounted(getMvs);

    return {
      mvs,
      nomalizeMv,
    };
  },
};
</script>


<style lang="stylus" scoped>
.mvs
  margin-top: 50px
.list
  display: flex
  justify-content: space-between
  margin-top: 20px
</style>