<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
import { useUserInfo } from '@/stores/userInfo'
import { useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'
import { listToTree } from '@/utils/util'

const router = useRouter()
const storeUserInfo = useUserInfo()
const app_store = useAppStore()

interface MenuItemType {
  path: string
  label: string
  icon?: string
  children?: MenuItemType[]
}
const clickMenuItem = (item: any) => {
  router.push({
    path: item.path
  })
}

const menuList: MenuItemType[] = reactive([])

const noChildren = () => {
  return menuList.filter((item) => !item.children)
}

const hasChildren = () => {
  return menuList.filter((item) => item.children)
}

onMounted(() => {
  console.log(listToTree(storeUserInfo.$state.routeList), 'rotelistTree')
  const menuTree = listToTree(storeUserInfo.$state.routeList)

  let userMenus = menuGenerator(menuTree)
  console.log(userMenus, 'userMenus')
  menuList.push(...userMenus)
  console.log(menuList, 'menuList')
})

const menuGenerator = (menuData: MenuTreeItem[]) => {
  const routerList = []
  for (const item of menuData) {
    if (item.hidden) {
      continue
    }

    // let icon = null
    // if (item.icon) {
    //   icon = item.icon
    // }
    const routerItem: MenuItemType = {
      path: item.route_path!,
      label: item.name!,
      icon: item.icon
    }
    if (item.children && item.children.length > 0) {
      routerItem.children = menuGenerator(item.children)
    }
    routerList.push(routerItem)
  }
  return routerList
}
</script>

<template>
  <el-aside :width="app_store.$state.isCollapse ? '180px' : '64px'">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#041527"
      text-color=" #FFFFFFB3"
      active-text-color="#FFFFFF"
      :collapse="!app_store.$state.isCollapse"
      :collapse-transition="false"
    >
      <h3 v-show="app_store.$state.isCollapse">RBAC Admin</h3>
      <h3 v-show="!app_store.$state.isCollapse">Admin</h3>
      <el-menu-item
        :index="item.path"
        :key="item.path"
        @click="clickMenuItem(item)"
        v-for="item in noChildren()"
      >
        <component class="icons" :is="item.icon" />
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu :index="item.path" :key="item.path" v-for="item in hasChildren()">
        <template #title>
          <component class="icons" :is="item.icon" />
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            :index="subItem.path"
            v-for="subItem in item.children"
            :key="subItem.path"
            @click="clickMenuItem(subItem)"
          >
            <component v-if="subItem.icon" class="icons" :is="subItem.icon" />
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<style scoped>
.icons {
  width: 18px;
  height: 18px;
}

.el-menu {
  border-right: none;
  h3 {
    line-height: 48px;
    color: #fff;
    text-align: center;
  }
  .el-sub-menu {
    .el-menu-item {
      background-color: #112133 !important;
    }
  }
}
</style>
