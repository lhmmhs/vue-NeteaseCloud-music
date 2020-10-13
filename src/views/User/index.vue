<template>
  <div class="user">
    <div class="profile" v-if="data.user">
      <div class="avatar-wrap">
        <img class="avatar" :src="`${data.user.profile.avatarUrl}?param=200y200`" />
      </div>
      <div class="profile-content">
        <div class="name-wrap">
          <span class="user-name">{{ data.user.profile.nickname }}</span>
          <span class="level">Lv.{{ data.user.level }}</span>
        </div>
        <div>
          <div class="event">
            <strong>{{ data.user.profile.eventCount }}</strong>
            <span>动态</span>
          </div>
          <div class="follows">
            <strong>{{ data.user.profile.follows }}</strong>
            <span>关注</span>
          </div>
          <div class="fans">
            <strong>{{ data.user.profile.followeds }}</strong>
            <span>粉丝</span>
          </div>
        </div>
      </div>
    </div>
    <div class="playlist">
      <h3>歌单</h3>
      <div class="list">
        <playlist-card
          v-for="item in data.playlist"
          :key="item.id"
          :id="item.id"
          :name="item.name"
          :picUrl="item.coverImgUrl"
          :playCount="formatPlayCount(item.playCount)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { requestUserDetail, requestUserRecord, requestUserPlaylist } from "@/api";
import { formatPlayCount } from "@/utils";
import playlistCard from "@/components/playlist-card";

export default {
  components: { playlistCard },

  setup() {
    const route = useRoute();

    const data = reactive({
      user: null,
      playlist: [],
    });

    watch(
      () => route.params,
      (params) => {
        getUserDetail(params.uid);
        getUserPlaylist(params.uid);
      }
    );

    const getUserDetail = async (uid) => {
      const user = await requestUserDetail(uid);
      data.user = user;
    };

    const getUserPlaylist = async (uid) => {
      const { playlist } = await requestUserPlaylist(uid);
      data.playlist = playlist;
    };

    onMounted(() => {
      getUserDetail(route.params.uid);
      getUserPlaylist(route.params.uid);
    });

    return {
      data,
      formatPlayCount,
    };
  },
};
</script>

<style lang="stylus" scoped>
.user
  padding: 20px 100px
.profile
  display: flex
.avatar-wrap
  width: 200px
  height: 200px
  margin-right: 20px
  box-shadow: 1px 1px 2px #ccc
  border-radius: 5px
.profile-content
  flex: 1
.name-wrap
  padding-bottom: 15px
  margin-bottom: 15px
  border-bottom: 1px solid #ebebeb
.user-name
  font-size: 28px
  margin-right: 10px
.event, .fans, .follows
  flex-direction: column
  display: inline-flex
  align-items: center
  padding-right: 30px
  strong
    font-size: 22px
.playlist
  margin-top: 50px
.list
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  margin-top: 10px
  >>> .img-wrap
    box-shadow: 1px 1px 2px #ccc
  >>> .playlist-card
    margin-bottom: 20px
  &:after
    content: ''
    flex: auto
</style>