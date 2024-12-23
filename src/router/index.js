import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/experiment',
    name: 'experiment',
    component: () => import(/* webpackChunkName: "about" */ '../views/Experiment.vue')
  },
  {
    path: '/complete',
    name: 'complete',
    component: () => import(/* webpackChunkName: "about" */ '../views/Complete.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
