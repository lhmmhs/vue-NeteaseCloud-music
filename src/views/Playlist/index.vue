<template>
  <div class="playlist">
    <div class="tags">
      <div class="tag-gruop" v-for="taggroup in data.tags">
        <div class="tag-category">{{ taggroup.category }}</div>
        <ul class="tag-list" @click="toggleTag">
          <li class="tag" v-for="tag in taggroup.arr">{{ tag }}</li>
        </ul>
      </div>
    </div>
    <div class="song-card-list">
      <playlist-card
        v-for="item in data.playlist"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :picUrl="item.coverImgUrl"
        :playCount="formatPlayCount(item.playCount)"
      />
    </div>
    <pager ref="pager" @currentPage="currentPageChange" :pageCount="Math.ceil(playlistTotal / 50)" :pagerCount="7" />
  </div>
</template>

<script>
import { requestPlaylitCatlist, requestTopPlaylistHighquality, requestTopPlaylist } from "@/api";
import { onMounted, reactive, ref } from "vue";
import playlistCard from "@/components/playlist-card";
import { formatPlayCount } from "@/utils";
import pager from "@/components/pager";

export default {
  components: { playlistCard, pager },
  setup() {
      


    const data = reactive({
      tags: {},
      playlist: [],
    });

    const playlistTotal = ref(0);
    const category = ref("全部");

    const pager = ref(null)

    const getPlaylistCatlist = async () => {
      const { categories, sub } = await requestPlaylitCatlist();

      sub.forEach((tag) => {
        if (data.tags[tag.category]) {
          data.tags[tag.category].arr.push(tag.name);
        } else {
          data.tags[tag.category] = { category: categories[tag.category], arr: [tag.name] };
        }
      });
    };

    const getTopPlaylist = async (cat, page) => {
      const { playlists, total } = await requestTopPlaylist(cat, 50, page);
      data.playlist = playlists;
      // 首次请求分类歌单设置总数
      if (page < 2) {
        playlistTotal.value = total;
      }
    };

    const toggleTag = (e) => {
      if (e.target.tagName !== "LI") return;
      let cat = e.target.innerText;
      getTopPlaylist(cat, 1);
      category.value = cat;
    };

    const currentPageChange = (currentPage) => {
      getTopPlaylist(category.value, currentPage);
    };

    onMounted(() => {
      getPlaylistCatlist();
      getTopPlaylist(category.value, 1);
    });


    return {
      data,
      playlistTotal,
      pager,

      toggleTag,
      currentPageChange,

      formatPlayCount,
    };
  },
};
</script>

<style lang="stylus" scoped>
.playlist
  padding: 20px 40px
.tag-gruop
  display: flex
  font-size: 13px
  margin-bottom: 20px
.tag-category
  margin-right: 20px
  font-weight: 700
.tag
  display: inline-block
  margin-right: 10px
  color: #999
  cursor: pointer
  &:hover, &.active
    color: #d33a31
.song-card-list
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  margin-top: 50px
  >>> .playlist-card
    margin-bottom: 20px
</style>