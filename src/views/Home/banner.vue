<template>
  <carousel type="card" height="200px" v-if="data.banners.length">
    <carousel-item v-for="item in data.banners" :key="item">
      <img class="banner-img" :src="`${item.imageUrl}?param=1000y400`" />
    </carousel-item>
  </carousel>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { requestBanner } from "@/api";
import carousel from "@/components/carousel/main";
import carouselItem from "@/components/carousel/item";

export default {
  components: { carousel, carouselItem },
  setup() {
    const data = reactive({
      banners: [],
    });

    const getBanners = async () => {
      const { banners } = await requestBanner();
      data.banners = banners;
    };

    onMounted(getBanners);

    return {
      data,
    };
  },
};
</script>


<style lang="stylus" scoped>
.banner-img
  width: 100%
  height: 100%
  border-radius: 4px
</style>