<template>
  <div class="header">
    <div></div>
    <div class="right">
      <div ref="resultPanelParent" class="search-wrap">
        <input
          class="search-input"
          v-model="keyWords"
          @input="onInput"
          @focus="onFocus"
          @keypress.enter="onEnter"
          type="text"
          placeholder="搜索"
        />
        <div class="result-panel" v-show="searchPanelShow">
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
          <btn @click="login">登录</btn>
        </div>
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
import { nomalizeSong } from "@/utils";
import btn from "@/components/button";

const resultMap = {
  albums: "专辑",
  artists: "歌手",
  playlists: "歌单",
  songs: "单曲",
};

function useSearch(store, router) {
  const data = reactive({
    result: {},
  });

  const searchPanelShow = ref(false);
  const keyWords = ref("");

  const getSearchSuggest = debounce(async (e) => {
    if (e.target.composing) return;

    if (keyWords.value === "") {
      return (searchPanelShow.value = false);
    }
    const { result } = await requestSearchSuggest(keyWords.value);
    let res = [];
    if (result.order) {
      for (let key in result) {
        if (key !== "order") {
          res.push({ key, content: result[key] });
        }
      }
      data.result = res;
      searchPanelShow.value = true;
    }
  }, 500);

  const onInput = getSearchSuggest;
  const onFocus = getSearchSuggest;

  const onEnter = (e) => {
    if (keyWords.value) {
      router.push(`/search/${keyWords.value}`);
      keyWords.value = "";
      searchPanelShow.value = false;
    }
  };

  const clickHandler = async (content, key) => {
    if (key.indexOf("song") > -1) {
      const { id, name, mvid, artists, duration, album } = content;
      const { songs } = await requestSongDetail(id);
      const { al } = songs[0];
      const song = nomalizeSong(id, name, al.picUrl, artists, duration, album, mvid);

      store.dispatch("music/playSong", song);
    } else {
      router.push(`/${key.slice(0, key.length - 1)}/${content.id}`);
    }
    keyWords.value = "";
    searchPanelShow.value = false;
  };

  return {
    data,
    searchPanelShow,
    keyWords,
    onInput,
    onFocus,
    onEnter,
    clickHandler,
  };
}

function useTogglePanelShow(searchPanelShow) {
  const resultPanelParent = ref(null);

  const clickEvent = (e) => {
    if (resultPanelParent.value.contains(e.target)) return;
    searchPanelShow.value = false;
  };

  const bindClick = () => {
    document.addEventListener("mousedown", clickEvent);
  };
  const removeClick = () => {
    document.removeEventListener("mousedown", clickEvent);
  };

  watch(searchPanelShow, (show) => {
    if (show) {
      bindClick();
    } else {
      removeClick();
    }
  });

  return {
    resultPanelParent,
  };
}

function useLogin(store) {
  const login = () => {
    store.commit("setLogin", true);
  };

  return {
    login,
  };
}

export default {
  components: { btn },
  setup() {
    const router = useRouter();
    const store = useStore();

    const profile = computed(() => store.state.user.profile);

    const { data, searchPanelShow, keyWords, onInput, onFocus, onEnter, clickHandler } = useSearch(store, router);

    const { resultPanelParent } = useTogglePanelShow(searchPanelShow);

    const { login } = useLogin(store);

    return {
      profile,

      resultMap,

      data,
      searchPanelShow,
      keyWords,
      onFocus,
      onInput,
      onEnter,
      clickHandler,

      resultPanelParent,

      login,
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
.search-input
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
</style>