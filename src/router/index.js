import Vue from 'vue'
import VueRouter from 'vue-router'
// import recommend from '../views/recommend'
// import singer from '../views/singer'
// import search from '../views/search'
// import rank from '../views/rank'
// import detail from '../views/singer/Detail'
const recommend = () => import('../views/recommend')
const singer = () => import('../views/singer')
const search = () => import('../views/search')
const rank = () => import('../views/rank')
const detail = () => import('../views/Detail')
const user = () => import('../views/User')

Vue.use(VueRouter)

const routes = [
  {
    path: '/recommend',
    component: recommend,
    children: [
      {
        path: 'detail',
        component: detail
      }
    ]
  },
  {
    path: '/singer',
    component: singer,
    children: [
      {
        path: 'detail',
        component: detail
      },
      {
        path: '/singer/:id',
        redirect: '/singer'
      }
    ]
  },
  {
    path: '/search',
    component: search
  },
  {
    path: '/user',
    component: user
  },
  {
    path: '/rank',
    component: rank,
    children: [
      {
        path: 'detail',
        component: detail
      },
      {
        path: '/rank/:id',
        redirect: '/rank'
      }
    ]
  },
  {
    path: '/',
    redirect: '/recommend'
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
