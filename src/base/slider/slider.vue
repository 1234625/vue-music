<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots" v-if="dots">
      <span
        class="dot"
        v-for="(item, index) in dots"
        :class="{ active: currentPageIndex === index }"
        :key="index"
      ></span>
    </div>
  </div>
</template>

<script>
import { addClass } from 'common/js/dom'
import BScroll from '@better-scroll/core'
import ObserveImage from '@better-scroll/observe-image'
import Slide from '@better-scroll/slide'

BScroll.use(ObserveImage)
BScroll.use(Slide)
export default {
  name: 'VueMusicSlider',

  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },

  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()
      this._initDots()
    }, 20)
  },

  methods: {
    _setSliderWidth(isResize) {
      // children 是dom伪数组  可以使用Array.from()将伪数组转为数组 使用数组方法
      this.children = this.$refs.sliderGroup.children
      let width = 0
      const sliderWidth = this.$refs.slider.clientWidth
      // for (let i = 0; i < this.children.length; i++) {
      //   const child = this.children[i]
      //   addClass(child, 'slider-item')
      //   child.style.width = sliderWidth + 'px'
      //   width += sliderWidth
      // }
      Array.from(this.children).forEach((el) => {
        addClass(el, 'slider-item')
        el.style.width = sliderWidth + 'px'
        width += sliderWidth
      })
      // if (this.loop && !isResize) {
      //   width += 2 * sliderWidth
      // }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      // 初始化bscroll
      this.slider = new BScroll(this.$refs.slider, {
        click: true,
        scrollX: true,
        scrollY: false,
        probeType: 2,
        observeimage: true,
        slide: true,
        momentum: false,
        loop: this.loop,
        autoplay: this.autoPlay,
        threshold: 0.3,
        speed: this.interval
      })
      // 图片滚动到结束
      this.slider.on('scrollEnd', () => {
        this.slider.getCurrentPage()
        if (this) {
        }
      })
      // 图片和逗号统一
      this.slider.on('slideWillChange', (page) => {
        this.currentPageIndex = page.pageX
      })
    },
    // 初始化轮播图下面点
    _initDots() {
      // console.log(this.children.length)
      this.dots = new Array(this.children.length - 2)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/variable';

.slider {
  min-height: 1px;
  position: relative;
  height: 100%;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    // height: 150px;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
