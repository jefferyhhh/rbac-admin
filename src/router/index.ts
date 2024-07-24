import { createRouter, createWebHistory, type RouteRecordSingleViewWithChildren } from 'vue-router'
import storage from 'store'
import { useUserInfo } from '@/stores/userInfo'
import { listToTree } from '@/utils/util'
import { generator } from './generateRouter'

// const storeUserInfo = useUserInfo()放这里不行

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login.vue')
  }
]
const rootRouter: RouteRecordSingleViewWithChildren = {
  path: '/',
  redirect: '/dashboard/workplace',
  name: 'dashboard',
  component: () => import('@/views/MainLayout.vue'),
  children: [
    {
      path: '/profile',
      name: 'Profile',
      meta: {
        title: '个人中心',
        keepAlive: true
      },
      component: () => import('../views/current/profile.vue')
    }
  ]
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

//路由守卫
router.beforeEach((to) => {
  console.log(to, 'to')

  const storeUserInfo = useUserInfo()
  const token = storage.get('Access-Token')
  if (!token && to.name !== 'Login') {
    // 用户未登录且不是前往登录页面，重定向到登录页面
    // next({ name: 'Login' })
    return { name: 'Login' }
  } else if (token && to.name === 'Login') {
    // 用户已登录且前往登录页面，重定向到首页
    // next({ name: 'Home' })
    return { path: '/' }
  } else if (token && !storeUserInfo.$state.hasGetRoute) {
    // 其他情况放行
    return storeUserInfo.getUserInfo().then(() => {
      const routersTree = listToTree(storeUserInfo.$state.routeList)
      const routerMap = generator(routersTree)
      rootRouter.children = [...rootRouter.children, ...routerMap]
      router.addRoute(rootRouter)
      return to.fullPath
    })
  }
})

export default router
