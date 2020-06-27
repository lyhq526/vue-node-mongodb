import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '默认',
    redirect:'/home',
  },
  {
    path: '/login',
    name: '登录',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/index')
  },
  {
    path: '/home',
    name: '首页',
    component: () => import(/* webpackChunkName: "about" */ '../views/index'),
    children: [
      {
        name: '首页',
        path: '/home',
        component: () => import('../views/home/index.vue')
      },
      {
        name: '腾讯视频签到',
        path: '/tentVideo',
        component: () => import('../views/tentVideo/index.vue')
      },
      {
        name: '天翼云盘签到',
        path: '/netdisc',
        component: () => import('../views/pan/index.vue')
      },
    ],
  }
]

const router = new VueRouter({
  routes
})

export default router
