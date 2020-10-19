<template>
  <div class="header">
    <div></div>
    <div class="right">
      <div class="search-wrap">
        <input class="search" v-model="keyWord" @input="changeKeyWord" type="text" placeholder="搜索" />
        <div class="result-panel" v-if="resultPanelShow">
          <div class="sub-panel" v-for="item in data.result">
            <div class="sub-panel-name">{{ resultMap[item.key] }}</div>
            <ul class="list">
              <li class="name" v-for="content in item.content" @click="clickHandler(content, item.key)">
                {{ content.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="header-user">
        <div v-if="profile.userId" class="avatar-wrap">
          <router-link :to="`/user/${profile.userId}`">
            <img class="avatar" :src="`${profile.avatarUrl}?param=30y30`" />
          </router-link>
        </div>
        <router-link v-else to="/login" class="login">登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from "vue";
import debounce from "lodash/debounce";
import { requestSearchSuggest, requestSongDetail } from "@/api";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { songUrl } from "@/utils";

const resultMap = {
  albums: "专辑",
  artists: "歌手",
  playlists: "歌单",
  songs: "单曲",
};

export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const data = reactive({
      result: {},
    });

    const resultPanelShow = ref(false);
    const keyWord = ref("");

    const profile = computed(() => store.state.user.profile);

    const changeKeyWord = debounce(async (e) => {
      if (e.target.value === "") return;
      const { result } = await requestSearchSuggest(e.target.value);
      let res = [];
      if (result.order) {
        for (let key in result) {
          if (key !== "order") {
            res.push({ key, content: result[key] });
          }
        }
        data.result = res;
        resultPanelShow.value = true;
      }
    }, 500);

    const clickHandler = async (content, key) => {
      if (key.indexOf("song") > -1) {
        const { id, name, mvid, artists, duration, album } = content;
        const { songs } = await requestSongDetail(id);
        const { al } = songs[0];
        const song = {
          id,
          name,
          picUrl: al.picUrl,
          artists,
          duration,
          album,
          url: songUrl(id),
          mvid,
        };
        store.dispatch("music/playSong", song);
      } else {
        router.push(`/${key.slice(0, key.length - 1)}/${content.id}`);
      }
      keyWord.value = "";
      resultPanelShow.value = false;
    };

    return {
      data,
      profile,
      keyWord,
      changeKeyWord,
      resultMap,
      clickHandler,
      resultPanelShow,
    };
  },
};
</script>

<style lang="stylus" scoped>
.header
  display: flex
  align-items: center
  justify-content: space-between
  position: fixed
  left: 0
  right: 0
  top: 0
  z-index: 4
  height: 50px
  padding: 0 30px
  background: #f9f9f9
  box-shadow: 2px -2px 4px #000
.right
  display: flex
  align-items: center
.search-wrap
  position: relative
  width: 160px
  height: 25px
  background: #ededed
  margin-right: 20px
.search
  height: 100%
  width: 100%
  padding: 0 20px
.result-panel
  position: absolute
  right: 0
  top: 25px
  background: #fff
  font-size: 13px
  box-shadow: -1px 0 4px rgba(0, 0, 0, 0.2)
.sub-panel
  display: flex
  &:last-child .list
    border-bottom: 0 none
  &:nth-child(even) .list
    background: #f9f8f8
.sub-panel-name
  width: 60px
  padding: 10px 0 0 10px
.list
  width: 150px
  border-left: 1px solid #ccc
  border-bottom: 1px solid #ccc
  padding: 6px 0 5px
.name
  text-overflow: ellipsis
  overflow: hidden
  white-space: nowrap
  cursor: pointer
  line-height: 24px
  padding-left: 6px
  &:hover
    background: #cecece
.avatar-wrap
  width: 30px
  height: 30px
  border-radius: 50%
  overflow: hidden
.login
  display: inline-block
  padding: 2px 4px
  font-size: 13px
  cursor: pointer
</style>