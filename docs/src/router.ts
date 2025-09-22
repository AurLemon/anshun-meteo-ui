import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/timeline',
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('./views/TimelineDoc.vue'),
  },
  {
    path: '/legend',
    name: 'Legend',
    component: () => import('./views/LegendDoc.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
