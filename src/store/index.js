import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './action'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 插件可以在控制台输出state的修改变化日志
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 开发环境下开启 strict 严格模式 vuex的state数据只能通过mutatios修改
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {},
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
