export const singer = (state) => state.singer

export const playing = (state) => state.playing

export const fullScreen = (state) => state.fullScreen

export const playList = (state) => state.playList

export const sequenceList = (state) => state.sequenceList

export const mode = (state) => state.mode

export const currentIndex = (state) => state.currentIndex

// 通过索引和播放列表确定当前播放的歌曲
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}

export const disc = (state) => state.disc

export const topList = (state) => state.topList

export const searchHistory = (state) => state.searchHistory

export const playHistory = (state) => state.playHistory

export const favoriteList = (state) => state.favoriteList
