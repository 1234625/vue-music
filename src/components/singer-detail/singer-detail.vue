<template>
  <div class="singer-detail">
    <transition name="slide">
      <music-list
        :title="title"
        :bg-image="bgImage"
        :songs="songs"
      ></music-list>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/Song'

import MusicList from '../music-list/music-list.vue'
export default {
  name: 'VueMusicSingerDetail',

  data() {
    return {
      songs: []
    }
  },

  mounted() {
    console.log(this.singer)
  },
  created() {
    this._getDetail()
  },

  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs(list) {
      const ret = []
      list.forEach((item) => {
        const { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  computed: {
    ...mapGetters(['singer']),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}
</style>
