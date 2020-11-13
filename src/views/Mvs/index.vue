<template>
  <div class="mvs">
    <div @click="toggleTags">
      <div class="tags" v-for="(tagGroup, key) in tagsMap">
        <div class="tag-name">{{ tagGroup.name }}</div>
        <ul>
          <li
            class="tag"
            v-for="(tag, index) in tagGroup.arr"
            :class="{ active: data[`${key}ActiveIndex`] === index }"
            :data-index="index"
            :data-type="key"
          >
            {{ tag }}
          </li>
        </ul>
      </div>
    </div>

    <div class="list">
      <mv-card
        v-for="mv in data.mvs"
        :id="mv.id"
        :name="mv.name"
        :picUrl="mv.cover"
        :artists="getArtists(mv.artists)"
        :playCount="formatPlayCount(mv.playCount)"
        :key="mv.id"
      />
    </div>

    <pager
      :current-page="currentPage"
      @current-page="currentPageHandler"
      :page-count="Math.ceil(mvsTotal / pageSize)"
    />
  </div>
</template>

<script>
import { requestMvAll } from "@/api";
import { onMounted, reactive, ref, watch } from "vue";
import mvCard from "@/components/mv-card";
import pager from "@/components/pager";
import { getArtists, formatPlayCount } from "@/utils";

const areas = ["全部", "内地", "港台", "欧美", "日本", "韩国"];
const types = ["全部", "官方版", "原声", "现场版", "网易出品"];
const orders = ["上升最快", "最热", "最新"];

const tagsMap = {
  areas: { name: "地区", arr: areas },
  types: { name: "类型", arr: types },
  orders: { name: "排序", arr: orders },
};

export default {
  components: { mvCard, pager },
  setup() {
    const data = reactive({
      mvs: [],
      areasActiveIndex: 0,
      typesActiveIndex: 0,
      ordersActiveIndex: 0,
    });

    const mvsTotal = ref(0);
    const pager = ref(null);
    const currentPage = ref(1);
    const pageSize = ref(40);

    const getMvAll = async (page) => {
      const { data: mvs, count } = await requestMvAll(
        areas[data.areasActiveIndex],
        types[data.typesActiveIndex],
        orders[data.ordersActiveIndex],
        pageSize.value,
        page
      );

      data.mvs = mvs;
      count && (mvsTotal.value = count);
    };

    const toggleTags = (e) => {
      if (e.target.tagName !== "LI") return;
      let index = e.target.dataset.index;
      let type = e.target.dataset.type;
      data[`${type}ActiveIndex`] = Number(index);
      currentPageHandler(1);
    };

    const currentPageHandler = (page) => {
      currentPage.value = page;
      getMvAll(page);
    };

    onMounted(() => {
      getMvAll(currentPage.value);
    });

    return {
      data,
      mvsTotal,
      pager,
      currentPage,
      pageSize,
      tagsMap,

      currentPageHandler,
      toggleTags,
      getArtists,
      formatPlayCount,
    };
  },
};
</script>

<style lang="stylus" scoped>
.mvs
  padding: 20px 40px
.tags
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
  justify-content: space-between
  flex-wrap: wrap
  >>> .mv-card
    margin-bottom: 16px
  &::after
    content: ''
    flex: auto
</style>