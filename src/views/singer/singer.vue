<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer.js'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/Singer'
import { mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

import ListView from 'base/listview/listview.vue'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  name: 'VueMusicSinger',
  mixins: [playlistMixin],
  components: {
    ListView
  },
  data() {
    return {
      message: '我是歌手页',
      singers: []
    }
  },

  created() {
    this._getSingerList()
  },
  mounted() {},

  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // 监听子组件发射的事件
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (ERR_OK === res.code) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 对请求到的数据 进行二次加工
    _normalizeSinger(list) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 压入 hot 对象的items数组中10个数据
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          )
        }
        // 在map 对象中添加为findindex的数组
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        /*  class Singer {
          constructor({ id, name }) {
            this.id = id
            this.name = name
            this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
          }
        } */
        // 创建一个Singer类 将得到的数据加入到map对象的 items 数组中
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        )
      })
      // 对得到数据map进行排序
      const hot = []
      const ret = []
      for (const key in map) {
        const val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 返回以 热门 为头部其他顺序为 A-Z 的顺序数据队列
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}</style>
