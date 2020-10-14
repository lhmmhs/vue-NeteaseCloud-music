<template>
  <carousel type="card" height="200px" v-if="data.banners.length">
    <carousel-item v-for="item in data.banners" :key="item" @click="playSong(item)">
      <img class="banner-img" :src="`${item.imageUrl}?param=1000y400`" />
    </carousel-item>
  </carousel>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { requestBanner, requestSongDetail } from "@/api";
import carousel from "@/components/carousel/main";
import carouselItem from "@/components/carousel/item";
import { songUrl } from "@/utils";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  components: { carousel, carouselItem },
  setup() {
    const store = useStore();
    const router = useRouter();

    const data = reactive({
      banners: [],
    });

    const getBanners = async () => {
      const { banners } = await requestBanner();
      data.banners = banners;
    };

    const playSong = async (banner) => {
      // 歌曲
      if (banner.targetType === 1) {
        const { songs } = await requestSongDetail(banner.targetId);
        const { al, ar, name, mv, dt } = songs[0];
        const song = {
          id: banner.targetId,
          name,
          picUrl: al.picUrl,
          album: al,
          duration: dt,
          artists: ar,
          url: songUrl(banner.targetId),
          mvid: mv,
        };

        store.dispatch("music/playSong", song);
      } else if (banner.targetType === 10) {
        // 专辑
        router.push(`/album/${banner.targetId}`);
      }
    };

    onMounted(getBanners);

    return {
      data,
      playSong,
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