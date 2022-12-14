<template>
  <div class="music-list">
    <!-- 返回按钮 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <!-- 头部背景图 -->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div
          ref="playBtn"
          v-show="songs.length > 0"
          class="play"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 背景 层 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 滚动列表 -->
    <scroll
      :data="songs"
      @scroll="scroll"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      class="list"
      ref="list"
    >
      <!-- 音乐列表组件 -->
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <!-- 加载组件 -->
      <div v-if="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import { prefixStyle } from 'common/js/dom'
import { playlistMixin } from 'common/js/mixin'
import { mapActions } from 'vuex'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  watch: {
    scrollY(newVal) {
      // 设置背景颜色滚动的最大距离为头部背景图的高度
      const translateY = Math.max(this.minTransalteY, newVal)
      let scale = 1
      let zIndex = 0
      let blur = 0
      const percent = Math.abs(newVal / this.imageHeight)
      if (newVal > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 20)
      }

      // 上拉头部背景图被覆盖
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`

      // 当滚动的距离小于最小滚动Y值时 将头部背景图的高度设置为 RESERVED_HEIGHT(40px)
      // 并且设置头部背景图的 padding-top 为 0
      if (newVal < this.minTransalteY) {
        // 层级
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      // 下拉背景图片伸缩
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      this.$refs.bgImage.style.zIndex = zIndex
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    // 处理·播放列表 底部mini播放栏遮挡内容
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // handleMini(val) {
    //   const bottom = val === false ? '60px' : ''
    //   this.$refs.list.$el.style.bottom = 'bottom'
    //   this.$refs.list.refresh()
    //   console.log('---')
    // },
    // 返回
    back() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  },

  components: {
    Loading,
    Scroll,
    SongList
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
