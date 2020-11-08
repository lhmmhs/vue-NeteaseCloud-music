<template>
  <div class="artists">
    <div class="tags" @click="toggleTags">
      <div class="tags-group" v-for="(tagGroup, key) in tagsMap">
        <div class="tag-name">{{ tagGroup.name }}</div>
        <ul>
          <li
            class="tag"
            v-for="(tag, index) in tagGroup.arr"
            :class="{ active: data[`${key}ActiveIndex`] === index }"
            :data-index="index"
            :data-type="key"
          >
            {{ tag.value || tag }}
          </li>
        </ul>
      </div>
    </div>
    <div class="list">
      <div class="artist-card" v-for="artist in data.artists">
        <div class="img-wrap">
          <router-link :to="`/artist/${artist.id}`">
            <img class="artist-img" v-lazy="`${artist.picUrl}?param=170y170`" />
          </router-link>
        </div>
        <div class="artist-name">
          <router-link :to="`/artist/${artist.id}`">{{ artist.name }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requestArtistList } from "@/api";
import { onMounted, reactive } from "vue";

const type = [
  { key: "-1", value: "全部" },
  { key: "1", value: "男歌手" },
  { key: "2", value: "女歌手" },
  { key: "3", value: "乐队" },
];

const area = [
  { key: "-1", value: "全部" },
  { key: "7", value: "华语" },
  { key: "96", value: "欧美" },
  { key: "8", value: "日本" },
  { key: "16", value: "韩国" },
  { key: "0", value: "其他" },
];

const initial = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const tagsMap = {
  type: { name: "分类", arr: type },
  area: { name: "地区", arr: area },
  initial: { name: "首字母", arr: initial },
};

export default {
  setup() {
    const data = reactive({
      artists: [],
      typeActiveIndex: 0,
      areaActiveIndex: 0,
      initialActiveIndex: 0,
    });

    const getArtistList = async () => {
      const { artists } = await requestArtistList(
        initial[data.initialActiveIndex],
        type[data.typeActiveIndex].key,
        area[data.areaActiveIndex].key,
        30
      );
      data.artists = artists;
    };

    const toggleTags = (e) => {
      if (e.target.tagName !== "LI") return;
      let index = e.target.dataset.index;
      let type = e.target.dataset.type;
      data[`${type}ActiveIndex`] = Number(index);
      getArtistList();
    };

    onMounted(getArtistList);

    return {
      data,
      tagsMap,
      toggleTags,
    };
  },
};
</script>

<style lang="stylus" scoped>
.artists
  padding: 20px 40px
.tags-group
  display: flex
  margin-bottom: 20px
  font-size: 14px
.tag-name
  font-weight: 700
  margin-right: 15px
.tag
  display: inline-block
  margin-right: 20px
  cursor: pointer
  &.active
    color: #d33a31
.list
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  margin-top: 50px
  &::after
    content: ''
    flex: auto
.artist-card
  width: 20%
  margin-bottom: 16px
  font-size: 0
.img-wrap
  display: inline-block
  width: 170px
  height: 170px
.artist-img
  width: 100%
  box-shadow: 1px 1px 4px #ccc
.artist-name
  margin-top: 4px
  font-size: 14px
</style>