var express = require('express')
var axios = require('axios')
// var proxyMiddleware = require('http-proxy-middleware')
var app = express()
var apiRoutes = express.Router()

axios.defaults.baseURL = '/api'
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        // src: '@',
        assets: '@/assets',
        common: '@/common',
        components: '@/components',
        api: '@/api',
        views: '@/views',
        base: '@/base'
      }
    }
  },
  // webpack的devServe选项 创建一个before方法 vuecli3利用axios欺骗refer
  devServer: {
    before(apiRoutes) {
      apiRoutes.get('/api/getDiscList', (req, res) => {
        const url =
          'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios
          .get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          })
          .then((response) => {
            res.json(response.data)
          })
          .catch((e) => {
            console.log(e)
          })
      })
      apiRoutes.get('/api/getSingerDetail', (req, res) => {
        const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
        axios
          .get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          })
          .then((response) => {
            res.json(response.data)
          })
          .catch((e) => {
            console.log(e)
          })
      })
      apiRoutes.get('/api/lyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg'
        axios
          .get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          })
          .then((response) => {
            var ret = response.data
            if (typeof ret === 'string') {
              // var reg = /^\w+\(({[^()]+})\)$/
              // var matches = ret.match(reg)
              // if (matches) {
              //   ret = JSON.parse(matches[1])
              // }
              res.json(ret)
            }
          })
          .catch((e) => {
            console.log(e)
          })
      })
      apiRoutes.get('/api/getSongList', function (req, res) {
        const url =
          'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        axios
          .get(url, {
            headers: {
              referer: 'https://y.qq.com/n/yqq/playlist',
              host: 'c.y.qq.com'
            },
            params: req.query
          })
          .then((response) => {
            var ret = response.data
            if (typeof ret === 'string') {
              var reg = /^\w+\(({[^()]+})\)$/
              var matches = ret.match(reg)
              if (matches) {
                ret = JSON.parse(matches[1])
              }
              res.json(ret)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
      apiRoutes.get('/api/search', function (req, res) {
        var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
        axios
          .get(url, {
            headers: {
              referer: 'https://y.qq.com/n/yqq/playlist',
              host: 'c.y.qq.com'
            },
            params: req.query
          })
          .then((response) => {
            var ret = response.data
            if (typeof ret === 'string') {
              // var reg = /^\w+\(({[^()]+})\)$/
              // var matches = ret.match(reg)
              // if (matches) {
              //   ret = JSON.parse(matches[1])
              // }
              res.json(ret)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
      app.use('/api', apiRoutes)
    }
  }
  /*  proxy: {
    // proxy api requests
    Object
    .keys(proxyTable)
    .forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
      options = {
        target: options
      }
    }
    app.use(proxyMiddleware(options.filter || context, options))
  })
  } */
}
