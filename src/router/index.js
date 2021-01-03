import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/DNAAlignment',
    name: 'DnaAlignment',
    component: () => import('../views/DnaAlignment.vue')
  },
  {
    path: '/MinesweeperJS',
    name: 'MinesweeperJS',
    component: () => import('../views/Minesweeper.vue')
  },
  {
    path: '/SpectrumToRGB',
    name: 'SpectrumToRGB',
    component: () => import('../views/SpectrumToRGB.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
