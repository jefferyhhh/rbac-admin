<script lang="ts" setup>
import CommonHeader from '../components/CommonHeader.vue'
import CommonAside from '../components/CommonAside.vue'

import { watch } from 'vue'
import { useRoute, type RouteLocationNormalized } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { isTags } from '@/utils/tags'

const $route = useRoute()
const app_store = useAppStore()

// const getTitle = (route: RouteLocationNormalized): string => {
//   let title: string = ''
//   if (!route.meta) {
//     // 处理无 meta 的路由
//     const pathArr: string[] = route.path.split('/')
//     title = pathArr[pathArr.length - 1]
//   } else {
//     title = route.meta.title as string
//   }
//   return title
// }

/**
 * 监听路由变化
 */
watch(
  $route,
  (to) => {
    if (!isTags(to.path)) return
    const { fullPath, meta, name, params, path, query } = to
    console.log('meta', meta)

    app_store.addTag({
      fullPath,
      meta,
      name,
      params,
      path,
      query
      // title: getTitle(to)
    })
    console.log('app_store.tagsViewList', app_store.tagsViewList)
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <CommonAside />
      <el-container class="r-container">
        <CommonHeader />
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.el-container {
  flex-wrap: wrap;
  align-items: flex-start;
}

.common-layout {
  .lay-container {
    flex-wrap: nowrap;
  }
  height: 100%;
  & > .el-container {
    height: 100%;
    & > .el-aside {
      height: 100%;
      background: #041527;
    }
  }
}
</style>
