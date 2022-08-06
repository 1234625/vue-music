<template>
  <div class="listview-div">
    <scroll
      :probeType="3"
      :pullUp="false"
      class="listview"
      :data="data"
      :listenScroll="listenScroll"
      @scroll="scroll"
      ref="listview"
    >
      <!-- center内容栏 -->
      <ul>
        <li
          v-for="(group, index) in data"
          class="list-group"
          ref="listGroup"
          :key="index"
        >
          <!-- A-Z内容栏 -->
          <h2 class="list-group-title">{{ group.title }}</h2>
          <ul>
            <li
              v-for="(item, index) in group.items"
              class="list-group-item"
              :key="index"
              @click="selectItem(item)"
            >
              <!-- 图片和姓名展示 -->
              <img v-lazy="item.avatar" class="avatar" width="50" height="50" />
              <span class="name">{{ item.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <!-- 右侧字母导航栏 -->
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop
    >
      <!-- 右侧字母导航栏 -->
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :data-index="index"
          :class="{ current: currentIndex === index }"
          class="item"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 固定标题栏 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
    <!-- 加载动画 -->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import Scroll from '../scroll/scroll.vue'
import { getData } from 'common/js/dom.js'
import Loading from '../loading/loading.vue'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 19
export default {
  name: 'VueMusicListview',

  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  mounted() {},
  created() {
    // 在create钩子函数里保存数据 可以使两个函数共享数据
    // 不在data（）中 保存数据是因为 在data 中保存的数据都添加了 set 和 get 数据用于与Dom 进行绑定
    // 此时Vue会对其中的数据改变进行观测，我们不需要对数据进行观测所以 保存在created 中就可以
    // 可以提高效率
    // touch 对象里存 每个dom对象开始时的 pageY 和 划到的 pageY 的值
    // touch.anchorIndex 是 dom 对象的 index值
    this.touch = {}
    // 是否监听滚动
    this.listenScroll = true
    // dom数组的高度
    this.listHeight = []
  },

  methods: {
    // 发射出一个事件
    selectItem(item) {
      this.$emit('select', item)
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    onShortcutTouchStart(e) {
      // 获取 dom 对象上自定义的data- 属性
      // const anchorIndex = e.target.dataset.index
      const anchorIndex = getData(e.target, 'index')
      const firstTouch = e.touches[0]
      // 调用dom对象的touch点击事件
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      // 调用 bs 对象方法滚动到指定dom
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      // e.touches TouchList{0:touch{},[[prototype]]}
      const firstTouch = e.touches[0]
      // dom 对象的 touch 事件
      this.touch.y2 = firstTouch.pageY
      // 锚点 当一个dom 对象 字母导航栏栏目差值为18 当划过超过18像素直接 调到下一个dom栏
      const delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      // 锚索引
      const anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll(position) {
      this.scrollY = position.y
    },
    // 计算 dom 对象的高度
    _calculateHeight() {
      this.listHeight = []
      // 取到 字母导航列表 的 dom 对象
      const list = this.$refs.listGroup
      // 计算每个字母导航 对应的组的高度 初始化height 和 listHeight
      let height = 0
      this.listHeight.push(height)
      // 遍历得到 每个列表高度
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _scrollTo(index) {
      // 点击监听 scrollY的值  新版本betterscroll 已经对scrollToElement优化监听scrollY的值
      // this.scrollY = -this.listHeight[index]
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      // console.log(this.scrollY)
    }
  },
  computed: {
    shortcutList() {
      // 返回右侧导航栏所用数据
      return this.data.map((group) => {
        return group.title.substring(0, 1)
      })
    },
    // 计算固定标题栏
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : ''
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    // 监听滚动的 Y 值 对特定条件进行判定
    scrollY(newY) {
      // 更新 listHeight 值
      const listHeight = this.listHeight
      // 当滚到顶部的时候
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 取到一个字母导航对应的高度值 和 他下一个导航对应的值
        const height1 = listHeight[i]
        const height2 = listHeight[i + 1]
        // 如果 滚动到的scrollY 值在两个组中间的话 返回当前字母导航
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      const fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.listview-div {
  height: 100%;

  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-backgroud;

    .list-group {
      position: relative;
      padding-bottom: 30px;

      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }

      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
  }

  .list-shortcut {
    // position: absolute;
    // z-index: 999;
    right: 10px;
    top: 50%;
    transform: translateY(-40%);
    position: fixed;
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    font-family: Helvetica;
    background: $color-background-d;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  // 中间固定标题栏样式
  .list-fixed {
    position: fixed;
    top: 87px;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: fixed;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
