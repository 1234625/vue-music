<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <!-- -->
      <scroll
        class="shortcut"
        ref="shortcut"
        :probeType="probetype"
        :data="shortcut"
        :refreshDelay="refreshDelay"
      >
        <div>
          <!-- 热搜 -->
          <div class="hot-key">
            <h1 class="title" @click="addQuery">热门搜索</h1>
            <ul>
              <li
                class="item"
                v-for="item in hotKey"
                :key="item.k"
                @click="addQuery(item.k)"
              >
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <!-- 搜索历史 -->
          <!-- <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConfirm" class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteSearchHistory"
            ></search-list>
          </div> -->
        </div>
      </scroll>
    </div>
    <!-- 搜索结果展示 -->
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest
        ref="suggest"
        :query="query"
        @select="saveSearch"
        @listScroll="blurInput"
      ></suggest>
    </div>
    <!-- <confirm
      ref="confirm"
      @confirm="clearSearchHistory"
      text="是否清空所有搜索历史"
      confirmBtnText="清空"
    ></confirm> -->
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
// import SearchList from 'base/search-list/search-list'
// import confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { searchMixin, playlistMixin } from 'common/js/mixin'

export default {
  mixins: [searchMixin, playlistMixin],
  components: {
    SearchBox,
    Suggest,
    // SearchList,
    // confirm,
    Scroll
  },
  data() {
    return {
      probetype: 3,
      hotKey: [
        { k: '孤勇者' },
        { k: '周杰伦' },
        { k: '林俊杰' },
        { k: '陈奕迅' },
        { k: '起风了' }
      ]
    }
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '60px' : 0

      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (ERR_OK === res.code) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
