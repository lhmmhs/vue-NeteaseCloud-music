<template>
  <ul class="pager" @click="onPagerClick">
    <li :class="{ active: data.currentPage === 1, disabled }" v-if="pageCount > 0" class="number">1</li>
    <li class="el-icon more btn-quickprev" :class="[ { disabled }]" v-if="data.showPrevMore">...</li>
    <li
      v-for="pager in pagers"
      :key="pager"
      :class="{ active: data.currentPage === pager, disabled }"
      class="number"
    >{{ pager }}</li>
    <li class="el-icon more btn-quicknext" :class="[ { disabled }]" v-if="data.showNextMore">...</li>
    <li
      :class="{ active: data.currentPage === pageCount, disabled }"
      class="number"
      v-if="pageCount > 1"
    >{{ pageCount }}</li>
  </ul>
</template>

<script>
import { reactive, ref, watch, computed } from "vue";

export default {
  props: {
    // currentPage: Number,
    // 总页数
    pageCount: Number,
    // 显示的页码数量
    // 大于等于 5 且小于等于 21 的奇数
    pagerCount: Number,
    disabled: Boolean,
  },
  setup(props) {
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

      data.showPrevMore = showPrevMore;
      data.showNextMore = showNextMore;

      console.log(data);

      return array;
    });

    // methods
    function onPagerClick(event) {
      const target = event.target;

      if (target.tagName === "UL" || data.disabled) return;

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

      console.log(newPage);

      if (!isNaN(newPage)) {
        if (newPage < 1) {
          newPage = 1;
        }
        if (newPage > pageCount) {
          newPage = pageCount;
        }
      }

      if (newPage !== currentPage) {
        // this.$emit("change", newPage);
        data.currentPage = newPage;
      }
    }

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
  li
    padding: 0 4px
    background: #fff
    vertical-align: top
    display: inline-block
    font-size: 13px
    min-width: 35.5px
    height: 28px
    line-height: 28px
    cursor: pointer
    box-sizing: border-box
    text-align: center
    margin: 0
    &.active
      color: #d33a31
</style>