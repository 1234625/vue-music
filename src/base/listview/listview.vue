<template>
  <scroll
    :probeType="3"
    :pullUp="false"
    class="listview"
    :data="data"
    ref="listview"
  >
    <ul>
      <li
        v-for="(group, index) in data"
        class="list-group"
        ref="listGroup"
        :key="index"
      >
        <!-- 热门 A-Z标题 -->
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            v-for="(item, index) in group.items"
            class="list-group-item"
            :key="index"
          >
            <!-- 图片和姓名展示 -->
            <img v-lazy="item.avatar" class="avatar" width="50" height="50" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>
</template>

<script>
import Scroll from '../scroll/scroll.vue'
export default {
  name: 'VueMusicListview',

  data() {
    return {}
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
    setTimeout(() => {
      console.log(this.data)
    }, 2000)
  },

  methods: {
    refresh() {
      this.$refs.listview.refresh()
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-backgroud;

  .list-group {
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

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
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

  .list-fixed {
    position: absolute;
    top: 0;
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
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
