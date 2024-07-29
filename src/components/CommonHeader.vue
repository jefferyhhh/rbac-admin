<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
import { useUserInfo } from '@/stores/userInfo'
import { computed } from 'vue'
import TagsView from '@/components/TagsView/index.vue'
import { useRouter } from 'vue-router'
import storage from 'store'

const router = useRouter()
//vite动态url，处理静态资源
const getImgScr = (avatar: string) => {
  return new URL(`../assets/${avatar}.png`, import.meta.url).href
}

const app_store = useAppStore()
const storeUserInfo = useUserInfo()
const userAvatar = computed(() => {
  return storeUserInfo.$state.basicInfo.avatar
})
const handleCollapse = () => {
  app_store.updateCollapse()
}
const crumbItemList = computed(() => {
  return app_store.$state.crumbItemList
})
console.log(crumbItemList.value, 990)

//下拉菜单
const handleCommand = (command: string) => {
  if (command === 'a') {
    console.log('个人中心')
    router.push('/profile')
  } else {
    storage.remove('Access-Token')
    storage.remove('Refresh-Token')
    // storage.remove('UserInfo');.......
    router.push('/login')
    console.log('退出')
  }
}
</script>

<template>
  <el-header>
    <!-- 图标 -->
    <div class="l-content">
      <el-button size="small" @click="handleCollapse">
        <el-icon>
          <Menu />
        </el-icon>
      </el-button>
      <BreadCrumb :crumbItemList="crumbItemList" />
    </div>
    <div class="r-content">
      <el-dropdown :hide-on-click="false" @command="handleCommand">
        <span class="el-dropdown-link">
          <img class="user" :src="userAvatar || getImgScr('avatar')" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a">个人中心</el-dropdown-item>
            <el-dropdown-item command="b"
              ><el-text class="mx-1" type="danger">退出</el-text></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
  <TagsView />
</template>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #ffffff;
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
  h3 {
    color: #fff;
  }
}
.bread :deep(span) {
  color: #000 !important;
}
</style>
