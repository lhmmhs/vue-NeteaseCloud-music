<template>
  <div class="playlist">
    <div class="detail" v-if="data.playlistDetail.coverImgUrl">
      <div class="img-wrap">
        <img v-lazy="`${data.playlistDetail.coverImgUrl}?param=200y200`" />
      </div>
      <div class="content">
        <h2 class="title">{{ data.playlistDetail.name }}</h2>
        <div class="creator">
          <img class="creator__avatar" v-lazy="`${data.playlistDetail.creator.avatarUrl}?param=40y40`" />
          <router-link :to="`/user/${data.playlistDetail.creator.userId}`" class="creator__name">
            {{ data.playlistDetail.creator.nickname }}
          </router-link>
        </div>
        <div class="create">{{ formatDate(data.playlistDetail.createTime) }} 创建</div>
        <div class="tags" v-if="data.playlistDetail.tags.length">
          标签：{{ (data.playlistDetail.tags || []).map((e) => e).join("/") }}
        </div>
        <div class="actions">
          <btn class="btn" @click="playAll">播放全部</btn>
          <btn class="btn" :disabled="profile.userId === data.playlistDetail.userId" @click="subscribe">
            {{ data.playlistDetail.subscribed ? "取消收藏" : "收藏" }}
          </btn>
        </div>
      </div>
    </div>
    <song-table :songs="data.songs" />
    <comments :id="$route.params.id" :type="'playlist'" />
  </div>
</template>

<script>
import { onMounted, computed, ref, provide, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { requestPlaylistDetail, requestPlaylistSubscribe } from "@/api";
import { formatDate, nomalizeSong } from "@/utils";

import songTable from "./song-table";
import comments from "@/components/comments";
import { useStore } from "vuex";

export default {
  components: { songTable, comments },
  setup() {
    const route = useRoute();
    const store = useStore();

    const status = computed(() => store.state.user.status);
    const profile = computed(() => store.state.user.profile);

    watch(
      () => route.params.id,
      (id) => {
        getPlaylistDetail(id);
      }
    );

    const data = reactive({
      playlistDetail: {},
      songs: [],
    });

    const getPlaylistDetail = async (id) => {
      const { playlist } = await requestPlaylistDetail(id);
      data.playlistDetail = playlist;
      data.songs = playlist.tracks.map(({ al, ar, dt, id, name, mv }) =>
        nomalizeSong(id, name, al.picUrl, ar, dt, al, mv)
      );
    };

    const subscribe = async () => {
      // 未登录
      if (!status.value) return;

      const t = data.playlistDetail.subscribed ? 0 : 1;
      const { code } = await requestPlaylistSubscribe(data.playlistDetail.id, t);
      if (code === 200) {
        data.playlistDetail.subscribed = !data.playlistDetail.subscribed;
      }
    };

    const playAll = async () => {
      store.commit("music/setPlaylist", data.songs);
      store.dispatch("music/playSong", data.songs[0]);
    };

    onMounted(() => {
      getPlaylistDetail(route.params.id);
    });

    return {
      data,
      formatDate,
      subscribe,
      profile,
      playAll,
    };
  },
};
</script>

<style lang="stylus" scoped>
.playlist
  padding: 20px 40px
.detail
  display: flex
.img-wrap
  width: 200px
  height: 200px
  box-shadow: 1px 1px 2px #ccc
  border-radius: 5px
.content
  margin-left: 20px
.title
  font-size: 20px
.creator
  display: flex
  align-items: center
  margin-top: 10px
.creator__avatar
  width: 40px
  height: 40px
  margin-right: 10px
  border-radius: 50%
  overflow: hidden
.creator__name
  color: #4996d1
.create
  margin-top: 10px
  font-size: 13px
  color: #999
.tags
  margin-top: 10px
  font-size: 14px
.actions
  margin-top: 20px
.btn
  margin-right: 10px
</style>