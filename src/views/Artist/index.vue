<template>
  <div class="artist">
    <div class="artist-profile">
      <div class="profile-header">
        <span class="artist-name">{{ data.artist.name }} </span>
        <span class="artist-alias">
          {{ (data.artist.alias || []).map((alia) => alia).join(" / ") }}
        </span>
      </div>
      <div class="artist-img-wrap">
        <img class="artist-img" v-if="data.artist.picUrl" v-lazy="`${data.artist.picUrl}?param=640y300`" />
      </div>
    </div>
    <div class="tabs" @click="toggleTabBar">
      <span :data-key="tab.key" class="tabs-item" :class="{ active: activeIndex === tab.key }" v-for="tab in tabMap">
        {{ tab.txt }}
      </span>
    </div>

    <div v-if="activeIndex === 'hotSongs'" class="tabs-content hot-song">
      <song-table :tableData="data.hotSongs" @row-dblclick="playSong">
        <song-table-column type="index" width="5%"></song-table-column>
        <song-table-column width="10%">
          <template v-slot:default="slotProps">
            <div class="img-wrap">
              <img class="al-img" v-lazy="`${slotProps.song.al.picUrl}?param=40y40`" />
              <div class="icon-play-wrap">
                <i class="iconfont icon-play"></i>
              </div>
            </div>
          </template>
        </song-table-column>
        <song-table-column label="音乐标题" width="45%">
          <template v-slot:default="slotProps">
            <span>{{ slotProps.song.name }}</span>
            <router-link class="mv-tag" v-if="slotProps.song.mv" :to="`/mv/${slotProps.song.mv}`">MV</router-link>
          </template>
        </song-table-column>
        <song-table-column prop="dt" label="时长" :formatter="formatTime" width="15%" />
        <song-table-column label="专辑" width="30%">
          <template v-slot:default="slotProps">
            <router-link :to="`/album/${slotProps.song.al.id}`">{{ slotProps.song.al.name }}</router-link>
          </template>
        </song-table-column>
      </song-table>
    </div>

    <div v-else-if="activeIndex === 'albums'" class="tabs-content albums">
      <div class="album-card" v-for="album in data.albums">
        <div class="album-img-wrap">
          <router-link :to="`/album/${album.id}`">
            <img class="album-img" v-lazy="`${album.picUrl}?param=150y150`" />
          </router-link>
          <div class="dish"></div>
        </div>
        <p class="album-name">{{ album.name }}</p>
        <p class="crete-time">{{ formatDate(album.publishTime) }}</p>
      </div>
    </div>

    <div v-else-if="activeIndex === 'mvs'" class="tabs-content mvs">
      <mv-card
        v-for="mv in data.mvs"
        :id="mv.id"
        :name="mv.name"
        :picUrl="mv.picUrl"
        :playCount="mv.playCount"
        :key="mv.id"
      />
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { requestArtists, requestArtistAlbum, requestArtistMv } from "@/api";
import { onMounted, reactive, watch, ref, nextTick } from "vue";
import { formatTime, formatPlayCount, nomalizeSong, formatDate } from "@/utils";
import songTable from "@/components/song-table/table";
import songTableColumn from "@/components/song-table/table-column";
import mvCard from "@/components/mv-card";

const tabMap = {
  hotSongs: { key: "hotSongs", txt: "热门作品" },
  albums: { key: "albums", txt: "歌手专辑" },
  mvs: { key: "mvs", txt: "相关MV" },
  // profile: { key: "profile", txt: "个人简介" },
};

export default {
  components: { songTable, songTableColumn, mvCard },
  setup() {
    const route = useRoute();
    const store = useStore();

    const data = reactive({
      artist: {},
      hotSongs: [],
      albums: [],
      mvs: [],
    });

    const activeIndex = ref("hotSongs");

    watch(
      () => route.params.id,
      (id) => {
        getArtists(id);
        getArtistAlbum(id);
        getArtistMv(id);
      }
    );

    const nomalizeMv = (mv) => {
      let { id, name, imgurl, artist, playCount } = mv;

      return {
        id,
        name,
        picUrl: imgurl,
        artist,
        playCount: formatPlayCount(playCount),
      };
    };

    const getArtistAlbum = async (id) => {
      const { hotAlbums } = await requestArtistAlbum(id, 20, 1);
      data.albums = hotAlbums;
    };

    const getArtistMv = async (id) => {
      const { mvs } = await requestArtistMv(id, 20, 1);
      data.mvs = mvs.map((mv) => nomalizeMv(mv));
    };

    const getArtists = async (id) => {
      const { artist, hotSongs } = await requestArtists(id, 20, 1);
      data.artist = artist;
      data.hotSongs = hotSongs;
    };

    const playSong = (rawSong) => {
      const { al, ar, dt, id, name, mv } = rawSong;
      const song = nomalizeSong(id, name, al.picUrl, ar, dt, al, mv);

      store.dispatch("music/playSong", song);
    };

    const toggleTabBar = (e, data) => {
      if (e.target.tagName !== "SPAN") return;
      activeIndex.value = e.target.dataset.key;
    };

    onMounted(() => {
      getArtists(route.params.id);
      getArtistAlbum(route.params.id);
      getArtistMv(route.params.id);
    });

    return {
      data,
      tabMap,
      activeIndex,

      playSong,
      formatTime,
      formatDate,
      toggleTabBar,
    };
  },
};
</script>

<style lang="stylus" scoped>
.artist
  padding: 20px 40px
.artist-profile
  margin-bottom: 50px
.artist-img-wrap
  width: 640px
  height: 300px
  border: 1px solid #999
.artist-img
  display: block
.tabs
  margin-bottom: 50px
  border-bottom: 1px solid #ccc
.tabs-item
  display: inline-block
  line-height: 30px
  margin-right: 30px
  cursor: pointer
  &.active
    color: #d33a31
    font-weight: 700
.mv-tag
  display: inline-block
  margin-left: 8px
  padding: 2px
  border: 1px solid
  color: #d33a31
  cursor: pointer
  font-size: 12px
.img-wrap
  position: relative
  width: 40px
  cursor: pointer
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2)
.al-img
  display: block
  margin: auto
.icon-play
  font-size: 14px
  color: #d33a31
.icon-play-wrap
  position: absolute
  left: 0
  right: 0
  bottom: 0
  top: 0
  width: 20px
  height: 20px
  margin: auto
  background: rgba(255, 255, 255, 0.7)
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
.mvs
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  &::after
    content: ''
    flex: auto
.mv-card
  margin-bottom: 16px
.albums
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  &::after
    content: ''
    flex: auto
.album-card
  width: 20%
  margin-bottom: 16px
.album-name
  width: 150px
  text-overflow: ellipsis
  overflow: hidden
  white-space: nowrap
  font-size: 13px
  margin-bottom: 2px
.crete-time
  font-size: 12px
  color: #666
.album-img-wrap
  position: relative
  width: 150px
  height: 150px
  margin-bottom: 10px
.album-img
  width: 100%
  height: 100%
  border: 1px solid #333
.dish
  position: absolute
  top: 0
  bottom: 0
  right: -30px
  z-index: -1
  width: 120px
  height: 120px
  margin: auto
  border-radius: 50%
  background: #333
  box-shadow: 0 0 10px #999
.profile-header
  display: flex
  align-items: flex-end
  margin-bottom: 16px
.artist-name
  font-size: 24px
.artist-alias
  margin-left: 10px
  color: #999
  font-size: 14px
</style>