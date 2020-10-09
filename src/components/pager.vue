<template>
  <ul class="pager" @click="onPagerClick">
    <li :class="{ active: data.currentPage === 1 }" v-if="pageCount > 0" class="number">1</li>
    <li class="more btn-quickprev" v-if="data.showPrevMore">...</li>
    <li
      v-for="pager in pagers"
      :key="pager"
      :class="{ active: data.currentPage === pager }"
      class="number"
    >
      {{ pager }}
    </li>
    <li class="more btn-quicknext" v-if="data.showNextMore">...</li>
    <li :class="{ active: data.currentPage === pageCount }" class="number" v-if="pageCount > 1">
      {{ pageCount }}
    </li>
  </ul>
</template>

<script>
import { reactive, ref, nextTick, computed, watch } from "vue";

export default {
  props: {
    // 总页数
    pageCount: Number,
    pagerCount: Number,
  },
  setup(props, { emit }) {
    const data = reactive({
      showPrevMore: false,
      showNextMore: false,
      currentPage: 1,
    });

    // computed
    const pagers = computed(() => {
      const pagerCount = props.pagerCount;

      // 一半的显示页码数量 7 -> 3
      const halfPagerCount = (pagerCount - 1) / 2;
      const currentPage = Number(data.currentPage);
      const pageCount = Number(props.pageCount);

      // 省略号标记
      let showPrevMore = false;
      let showNextMore = false;

      // 处理显示省略号
      if (pageCount > pagerCount) {
        //  5 > 1 2 3 4
        if (currentPage > pagerCount - halfPagerCount) {
          showPrevMore = true;
        }
        // 96 < 97 98 99 100
        if (currentPage < pageCount - halfPagerCount) {
          showNextMore = true;
        }
      }

      //
      const array = [];

      // 处理显示中间的页码
      if (showPrevMore && !showNextMore) {
        // 1 ... 95 96 97 98 99 100
        const startPage = pageCount - (pagerCount - 2);
        for (let i = startPage; i < pageCount; i++) {
          array.push(i);
        }
      } else if (!showPrevMore && showNextMore) {
        // 1 2 3 4 5 6 ... 100
        for (let i = 2; i < pagerCount; i++) {
          array.push(i);
        }
      } else if (showPrevMore && showNextMore) {
        // 1...3 4 5 6 7 ... 100
        const offset = Math.floor(pagerCount / 2) - 1;
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          array.push(i);
        }
      } else {
        for (let i = 2; i < pageCount; i++) {
          array.push(i);
        }
      }

      nextTick(() => {
        data.showPrevMore = showPrevMore;
        data.showNextMore = showNextMore;
      });

      return array;
    });

    // methods
    function onPagerClick(event) {
      const target = event.target;

      if (target.tagName === "UL") return;

      let newPage = Number(event.target.textContent);
      const pageCount = props.pageCount;
      const currentPage = data.currentPage;
      const pagerCountOffset = props.pagerCount - 2;

      // 点击省略号
      if (target.className.indexOf("more") !== -1) {
        if (target.className.indexOf("quickprev") !== -1) {
          newPage = currentPage - pagerCountOffset;
        } else if (target.className.indexOf("quicknext") !== -1) {
          newPage = currentPage + pagerCountOffset;
        }
      }

      if (!isNaN(newPage)) {
        if (newPage < 1) {
          newPage = 1;
        }
        if (newPage > pageCount) {
          newPage = pageCount;
        }
      }

      if (newPage !== currentPage) {
        data.currentPage = newPage;
      }
    }

    // watch
    watch(
      () => data.currentPage,
      (page) => {
        console.log(page);
        emit("currentPage", page);
      }
    );

    return {
      data,

      pagers,

      onPagerClick,
    };
  },
};
</script>

<style lang="stylus" scoped>
.pager
  user-select: none
  list-style: none
  font-size: 0
  text-align: center
  margin-top: 25px
  li
    padding: 0 4px
    vertical-align: top
    display: inline-block
    font-size: 14px
    min-width: 35.5px
    height: 28px
    line-height: 28px
    cursor: pointer
    box-sizing: border-box
    text-align: center
    margin: 0
    font-weight: 700
    &.active
      color: #d33a31
      cursor: default
</style>