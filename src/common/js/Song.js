// import {
//   Base64
// } from 'js-base64'
import { ERR_OK } from 'api/config'
import { getLyric } from 'api/song'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        if (res.retcode === ERR_OK) {
          // this.lyric = Base64.decode(res.lyric)
          // 解析歌词
          const div = document.createElement('div')
          div.innerHTML = res.lyric
          this.lyric = div.innerText
          resolve(this.lyric)
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?uin=6742&fromtag=38&guid=105597218`
    // url: `https://api.bzqll.com/music/tencent/url?key=579621905&id=${musicData.songmid}?br=320`
    url: `http://isure.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=267829250&vkey=92BA3A941BC3982D83389FAED1BADD3172309CF08755735153894E9D279EFA4928E853CBDFA0C761865D0A1D53C6C7EEB46692A49CDD72E0&uin=&fromtag=3`
  })
}

function filterSinger(singer) {
  const ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
