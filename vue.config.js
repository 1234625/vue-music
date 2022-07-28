var express = require('express')
var axios = require('axios')
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
      app.use('/api', apiRoutes)
    }
  }
}
