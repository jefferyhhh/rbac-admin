import './assets/less/index.less'
import api from './api/api'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { useAppStore } from '@/stores/app'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//mock
// import { mockRequest } from './api/mock'
// mockRequest()

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api?: any
  }
}
app.config.globalProperties.$api = api

app.use(createPinia())
app.use(router)

const appStore = useAppStore()

router.beforeEach((to) => {
  const crumbItemList = to.matched.map((item) => ({
    to: { ...item },
    name: item.name
  }))
  appStore.replaceCrumb(crumbItemList)
})

app.mount('#app')
