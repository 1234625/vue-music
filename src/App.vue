<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/my-header/my-header.vue'
import Tab from 'components/tab/tab.vue'
import Player from 'components/player/player.vue'
export default {
  name: 'VueMusicApp',

  data() {
    return {
      name: 'why'
    }
  },

  mounted() {},

  methods: {},
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~/src/common/stylus/variable.styl';
</style>
