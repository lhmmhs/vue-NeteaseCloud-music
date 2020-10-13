<template>
  <div class="mvs">
    <h3>推荐MV</h3>
    <div class="list">
      <mv-card
        v-for="mv in data.mvs"
        :id="mv.id"
        :name="mv.name"
        :picUrl="mv.picUrl"
        :artists="mv.artists"
        :playCount="mv.playCount"
        :key="mv.id"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { requestMvs } from "@/api";
import mvCard from "@/components/mv-card";
import { getArtists, formatPlayCount } from "@/utils";

export default {
  components: { mvCard },
  setup() {
    const data = reactive({
      mvs: [],
    });

    const nomalize = (mv) => {
      let { id, name, picUrl, artists, playCount } = mv;

      return {
        id,
        name,
        picUrl,
        artists: getArtists(artists),
        playCount: formatPlayCount(playCount),
      };
    };

    // methods
    const getMvs = async () => {
      let { result } = await requestMvs();
      data.mvs = result;

      data.mvs = result.map((mv) => nomalize(mv));
    };

    // lifecycle
    onMounted(getMvs);

    return {
      data,
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