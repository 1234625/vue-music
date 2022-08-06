import Vue from 'vue'
import VueRouter from 'vue-router'

const Recommend = (resolve) => {
  import('views/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const Rank = (resolve) => {
  import('views/rank/rank').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('views/singer/singer').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('views/search/search').then((module) => {
    resolve(module)
  })
}
const SingerDetail = () => import('components/singer-detail/singer-detail.vue')
const Disc = () => import('components/disc/disc.vue')
const TopList = () => import('components/top-list/top-list.vue')
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Disc
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: TopList
      }
    ]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
