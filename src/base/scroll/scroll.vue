<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import Pullup from '@better-scroll/pull-up'
import ObserveImage from '@better-scroll/observe-image'

BScroll.use(ObserveDOM)
BScroll.use(Pullup)
BScroll.use(ObserveImage)

export default {
  name: 'VueMusicScroll',

  data() {
    return {
      bs: null
    }
  },
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    pullUp: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },

  methods: {
    // 初始化滚动
    _initScroll() {
      // 创建bs对象
      this.bs = new BScroll(this.$refs.wrapper, {
        observeDOM: true,
        scrollY: true,
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUp,
        observeImage: {
          debounceTime: 100 // ms  当图片加载失败100ms后调用refresh方法 重新计算可滚动的高度或者宽度
        }
      })
      if (this.listenScroll) {
        // 监听位置信息
        this.bs.on('scroll', (position) => {
          this.$emit('scroll', position)
        })
      }
      if (this.beforeScroll) {
        // 滚动开始之前
        this.bs.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }

      // 监听上拉加载事件
      if (this.pullUp) {
        this.bs.on('pullingUp', () => {
          this.$emit('pullingup')
          // 2.x版本改版只能在 上拉事件触发以后调用finishPullUp()方法 调用下一个上拉事件
          this.finishPullUp()
        })
      }
    },
    scrollto(x, y, time = 300) {
      this.bs && this.bs.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.bs && this.bs.finishPullUp()
    },
    refresh() {
      this.bs && this.bs.refresh()
    },
    // 监听y轴位置
    getScrollY() {
      return this.bs ? this.bs.y : 0
    },
    scrollTo() {
      this.bs && this.bs.scrollTo.apply(this.bs, arguments)
    },
    scrollToElement() {
      this.bs && this.bs.scrollToElement.apply(this.bs, arguments)
    }
  },
  watch: {
    // 监听data变化，若data变化则对scroll进行刷新
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style lang="stylus" scoped></style>
