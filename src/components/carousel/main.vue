<template>
  <div ref="root" :class="carouselClasses" @mouseenter.stop="handleMouseEnter" @mouseleave.stop="handleMouseLeave">
    <div class="el-carousel__container" :style="{ height: height }">
      <!-- <transition v-if="arrowDisplay" name="carousel-arrow-left">
        <button
          v-show="(arrow === 'always' || data.hover) && (props.loop || data.activeIndex > 0)"
          type="button"
          class="el-carousel__arrow el-carousel__arrow--left"
          @mouseenter="handleButtonEnter('left')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(data.activeIndex - 1)"
        >
          <i class="iconfont icon-prev"></i>
        </button>
      </transition> -->
      <!-- <transition v-if="arrowDisplay" name="carousel-arrow-right">
        <button
          v-show="(arrow === 'always' || data.hover) && (props.loop || data.activeIndex < items.value.length - 1)"
          type="button"
          class="el-carousel__arrow el-carousel__arrow--right"
          @mouseenter="handleButtonEnter('right')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(data.activeIndex + 1)"
        >
          <i class="iconfont icon-next"></i>
        </button>
      </transition> -->
      <slot></slot>
    </div>
    <ul v-if="indicatorPosition !== 'none'" :class="indicatorsClasses">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="['el-carousel__indicator', 'el-carousel__indicator--' + direction, { 'is-active': index === data.activeIndex }]"
        @mouseenter="throttledIndicatorHover(index)"
        @click.stop="handleIndicatorClick(index)"
      >
        <button class="el-carousel__button">
          <span v-if="hasLabel">{{ item.label }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script >
import { reactive, computed, ref, Ref, provide, onMounted, ToRefs, UnwrapRef, onBeforeUnmount, watch, nextTick } from "vue";
import throttle from "lodash/throttle";
import { addResizeListener, removeResizeListener } from "@/utils";

export default {
  name: "ElCarousel",
  props: {
    initialIndex: {
      type: Number,
      default: 0,
    },
    height: { type: String, default: "" },
    trigger: {
      type: String,
      default: "hover",
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    indicatorPosition: { type: String, default: "" },
    indicator: {
      type: Boolean,
      default: true,
    },
    arrow: {
      type: String,
      default: "hover",
    },
    type: { type: String, default: "" },
    loop: {
      type: Boolean,
      default: true,
    },
    direction: {
      type: String,
      default: "horizontal",
      validator(val) {
        return ["horizontal", "vertical"].includes(val);
      },
    },
  },
  emits: ["change"],
  setup(props, { emit }) {
    // data
    const data = reactive({
      activeIndex: -1,
      containerWidth: 0,
      timer: null,
      hover: false,
    });
    // refs
    const root = ref(null);
    const items = ref([]);
    const offsetWidth = ref(0);
    const offsetHeight = ref(0);
    // computed
    const arrowDisplay = computed(() => props.arrow !== "never" && props.direction !== "vertical");
    const hasLabel = computed(() => {
      return items.value.some((item) => item.label.toString().length > 0);
    });
    const carouselClasses = computed(() => {
      const classes = ["el-carousel", "el-carousel--" + props.direction];
      if (props.type === "card") {
        classes.push("el-carousel--card");
      }
      return classes;
    });
    const indicatorsClasses = computed(() => {
      const classes = ["el-carousel__indicators", "el-carousel__indicators--" + props.direction];
      if (hasLabel.value) {
        classes.push("el-carousel__indicators--labels");
      }
      if (props.indicatorPosition === "outside" || props.type === "card") {
        classes.push("el-carousel__indicators--outside");
      }
      return classes;
    });
    // methods
    const throttledArrowClick = throttle(
      (index) => {
        setActiveItem(index);
      },
      300,
      { trailing: true }
    );
    const throttledIndicatorHover = throttle((index) => {
      handleIndicatorHover(index);
    }, 300);
    function pauseTimer() {
      if (data.timer) {
        clearInterval(data.timer);
        data.timer = null;
      }
    }
    function startTimer() {
      if (props.interval <= 0 || !props.autoplay || data.timer) return;
      data.timer = setInterval(() => playSlides(), props.interval);
    }
    const playSlides = () => {
      if (data.activeIndex < items.value.length - 1) {
        data.activeIndex = data.activeIndex + 1;
      } else if (props.loop) {
        data.activeIndex = 0;
      }
    };
    function setActiveItem(index) {
      if (typeof index === "string") {
        const filteredItems = items.value.filter((item) => item.name === index);
        if (filteredItems.length > 0) {
          index = items.value.indexOf(filteredItems[0]);
        }
      }
      index = Number(index);
      if (isNaN(index) || index !== Math.floor(index)) {
        console.warn("[Element Warn][Carousel]index must be an integer.");
        return;
      }
      let length = items.value.length;
      const oldIndex = data.activeIndex;
      if (index < 0) {
        data.activeIndex = props.loop ? length - 1 : 0;
      } else if (index >= length) {
        data.activeIndex = props.loop ? 0 : length - 1;
      } else {
        data.activeIndex = index;
      }
      if (oldIndex === data.activeIndex) {
        resetItemPosition(oldIndex);
      }
    }
    function resetItemPosition(oldIndex) {
      items.value.forEach((item, index) => {
        item.translateItem(index, data.activeIndex, oldIndex);
      });
    }
    function updateItems(item) {
      items.value.push(item);
    }
    function itemInStage(item, index) {
      const length = items.value.length;
      if ((index === length - 1 && item.inStage && items.value[0].active) || (item.inStage && items.value[index + 1] && items.value[index + 1].active)) {
        return "left";
      } else if ((index === 0 && item.inStage && items.value[length - 1].active) || (item.inStage && items.value[index - 1] && items.value[index - 1].active)) {
        return "right";
      }
      return false;
    }
    function handleMouseEnter() {
      data.hover = true;
      pauseTimer();
    }
    function handleMouseLeave() {
      data.hover = false;
      startTimer();
    }
    function handleButtonEnter(arrow) {
      if (props.direction === "vertical") return;
      items.value.forEach((item, index) => {
        if (arrow === itemInStage(item, index)) {
          item.hover = true;
        }
      });
    }
    function handleButtonLeave() {
      if (props.direction === "vertical") return;
      items.value.forEach((item) => {
        item.hover = false;
      });
    }
    function handleIndicatorClick(index) {
      data.activeIndex = index;
    }
    function handleIndicatorHover(index) {
      if (props.trigger === "hover" && index !== data.activeIndex) {
        data.activeIndex = index;
      }
    }
    function prev() {
      setActiveItem(data.activeIndex - 1);
    }
    function next() {
      setActiveItem(data.activeIndex + 1);
    }
    // watch
    watch(
      () => data.activeIndex,
      (current, prev) => {
        resetItemPosition(prev);
        if (prev > -1) {
          emit("change", current, prev);
        }
      }
    );
    watch(
      () => props.autoplay,
      (current) => {
        current ? startTimer() : pauseTimer();
      }
    );
    watch(
      () => props.loop,
      () => {
        setActiveItem(data.activeIndex);
      }
    );
    // lifecycle
    onMounted(() => {
      nextTick(() => {
        addResizeListener(root.value, resetItemPosition);
        if (root.value) {
          offsetWidth.value = root.value.offsetWidth;
          offsetHeight.value = root.value.offsetHeight;
        }
        //
        if (props.initialIndex < items.value.length && props.initialIndex >= 0) {
          data.activeIndex = props.initialIndex;
        }
        startTimer();
      });
    });
    onBeforeUnmount(() => {
      if (root.value) removeResizeListener(root.value, resetItemPosition);
      pauseTimer();
    });
    // provide
    provide("injectCarouselScope", {
      direction: props.direction,
      offsetWidth,
      offsetHeight,
      type: props.type,
      items,
      loop: props.loop,
      updateItems,
      setActiveItem,
    });
    return {
      data,
      props,
      items,
      arrowDisplay,
      carouselClasses,
      indicatorsClasses,
      hasLabel,
      handleMouseEnter,
      handleMouseLeave,
      handleIndicatorClick,
      throttledArrowClick,
      throttledIndicatorHover,
      handleButtonEnter,
      handleButtonLeave,
      prev,
      next,
      setActiveItem,
      root,
    };
  },
};
</script>

<style lang="stylus">
.el-carousel
  position: relative
.el-carousel--horizontal
  overflow-x: hidden
.el-carousel--vertical
  overflow-y: hidden
.el-carousel__container
  position: relative
  height: 300px
.el-carousel__arrow
  border: none
  outline: 0
  padding: 0
  margin: 0
  height: 36px
  width: 36px
  cursor: pointer
  -webkit-transition: 0.3s
  transition: 0.3s
  border-radius: 50%
  background-color: rgba(31, 45, 61, 0.11)
  color: #fff
  position: absolute
  top: 50%
  z-index: 10
  -webkit-transform: translateY(-50%)
  transform: translateY(-50%)
  text-align: center
  font-size: 12px
.el-carousel__arrow--left
  left: 16px
.el-carousel__arrow--right
  right: 16px
.el-carousel__arrow:hover
  background-color: rgba(31, 45, 61, 0.23)
.el-carousel__arrow i
  cursor: pointer
.el-carousel__indicators
  position: absolute
  list-style: none
  margin: 0
  padding: 0
  z-index: 2
.el-carousel__indicators--horizontal
  bottom: 0
  left: 50%
  -webkit-transform: translateX(-50%)
  transform: translateX(-50%)
.el-carousel__indicators--vertical
  right: 0
  top: 50%
  -webkit-transform: translateY(-50%)
  transform: translateY(-50%)
.el-carousel__indicators--outside
  bottom: 26px
  text-align: center
  position: static
  -webkit-transform: none
  transform: none
.el-carousel__indicators--outside .el-carousel__indicator:hover button
  opacity: 0.64
.el-carousel__indicators--outside button
  background-color: #c0c4cc
  opacity: 0.24
.el-carousel__indicators--labels
  left: 0
  right: 0
  -webkit-transform: none
  transform: none
  text-align: center
.el-carousel__indicators--labels .el-carousel__button
  height: auto
  width: auto
  padding: 2px 18px
  font-size: 12px
.el-carousel__indicators--labels .el-carousel__indicator
  padding: 6px 4px
.el-carousel__indicator
  background-color: transparent
  cursor: pointer
.el-carousel__indicator:hover button
  opacity: 0.72
.el-carousel__indicator--horizontal
  display: inline-block
  padding: 12px 4px
.el-carousel__indicator--vertical
  padding: 4px 12px
.el-carousel__indicator--vertical .el-carousel__button
  width: 2px
  height: 15px
.el-carousel__indicator.is-active button
  opacity: 1
.el-carousel__button
  display: block
  opacity: 0.48
  width: 30px
  height: 2px
  background-color: #fff
  border: none
  outline: 0
  padding: 0
  margin: 0
  cursor: pointer
  -webkit-transition: 0.3s
  transition: 0.3s
.carousel-arrow-left-enter, .carousel-arrow-left-leave-active
  -webkit-transform: translateY(-50%) translateX(-10px)
  transform: translateY(-50%) translateX(-10px)
  opacity: 0
.carousel-arrow-right-enter, .carousel-arrow-right-leave-active
  -webkit-transform: translateY(-50%) translateX(10px)
  transform: translateY(-50%) translateX(10px)
  opacity: 0
</style>