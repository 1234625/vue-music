import { playMode } from 'common/js/config.js'
import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache'

const state = {
  singer: {}, // 歌手信息
  playing: false, // 播放状态
  fullScreen: false, // 是否全屏
  playList: [], // 播放歌曲列表
  sequenceList: [], // 顺序歌曲队列列表
  mode: playMode.sequence, // 模式
  currentIndex: -1, // 当前歌曲的索引
  disc: {}, // 推荐页歌单
  topList: {}, // 排行列表
  searchHistory: loadSearch(),
  playHistory: loadPlay(), // 从localstroge内存中读取 playHistory 的值
  favoriteList: loadFavorite()
}
export default state
