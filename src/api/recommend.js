import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getRecommend() {
  const url =
    'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
    /* 将返回的jsonp格式化为json对象 */
  })

  return axios
    .get(url, {
      params: data
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

export function getSongList(disstid) {
  const url = '/api/getSongList'

  const data = Object.assign(
    {},
    {
      disstid,
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      format: 'jsonp',
      g_tk: 5381,
      jsonpCallback: 'playlistinfoCallback',
      loginUin: 0,
      hostUin: 0,
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq',
      needNewCode: 0
    }
  )
  return axios
    .get(url, {
      params: data
    })
    .then((res) => {
      let result = res.data.substring(21, res.data.length - 1)
      result = JSON.parse(result)
      return Promise.resolve(result)
    })
}
