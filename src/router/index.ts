import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Main.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/home/home.vue')
        }
      ]
    }
  ]
})

export default router
