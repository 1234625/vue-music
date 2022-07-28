<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MHeader from 'components/my-header/my-header.vue'
import Tab from 'components/tab/tab.vue'
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
    Tab
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../src/common/stylus/variable.styl';
</style>
