<template>
  <div class="recommend" ref="recommend">
    <scroll
      ref="scroll"
      class="recommend-content"
      :probeType="3"
      :pullUp="false"
    >
      <!-- 轮播图 -->
      <div v-if="recommends.length" class="slider-wrapper">
        <slider>
          <div v-for="(item, index) in recommends" :key="index">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" />
            </a>
          </div>
        </slider>
      </div>
      <!-- 热门榜单列表 -->
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li
            class="item"
            v-for="(item, index) in discList"
            :key="index"
            @click="selectItem(item)"
          >
            <div class="icon">
              <img v-lazy="item.imgurl" width="60" height="60" />
            </div>
            <div class="text">
              <h2 class="name">{{ item.creator.name }}</h2>
              <p class="desc">{{ item.dissname }}</p>
            </div>
          </li>
        </ul>
      </div>
      <!-- 等待加载 -->
      <div class="loading-container" v-show="!discList.length">
        <loading :title="'正在加载中'"> </loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider.vue'
import Scroll from 'base/scroll/scroll.vue'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  components: {
    Slider,
    Scroll,
    Loading
  },
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  mounted() {
    setTimeout(() => {
      // console.log(this.discList)
    }, 2000)
  },
  activated() {
    this.$refs.scroll.refresh()
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if (ERR_OK === res.code) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        // console.log(res)
        if (ERR_OK === res.code) {
          this.discList = res.data.list
        }
      })
    },
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
