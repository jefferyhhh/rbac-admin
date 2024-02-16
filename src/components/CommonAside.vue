<script lang="ts" setup>
import { asideCollStore } from '@/stores/asideColl'
import { useRouter } from 'vue-router'
const router = useRouter()

const asideColl = asideCollStore()

const clickMenuItem = (item: any) => {
  router.push({
    name: item.name
  })
}

const list = [
  {
    path: '/user',
    name: 'user',
    label: '用户管理',
    icon: 'user',
    url: ''
  },
  {
    label: '其他',
    path: '/other',
    icon: 'location',
    children: [
      {
        path: '/page1',
        name: 'page1',
        label: '页面一',
        icon: 'setting',
        url: 'Other/PageOne'
      },
      {
        path: '/page2',
        name: 'page2',
        label: '页面二',
        icon: 'setting',
        url: 'Other/PageTwo'
      }
    ]
  }
]

const noChildren = () => {
  return list.filter((item) => !item.children)
}

const hasChildren = () => {
  return list.filter((item) => item.children)
}
</script>

<template>
  <el-aside :width="asideColl.$state.isCollapse ? '180px' : '64px'">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      :collapse="!asideColl.$state.isCollapse"
      :collapse-transition="false"
    >
      <h3 v-show="asideColl.$state.isCollapse">后台管理</h3>
      <h3 v-show="!asideColl.$state.isCollapse">后台</h3>
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
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
            @click="clickMenuItem(subItem)"
          >
            <component class="icons" :is="subItem.icon" />
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
}
</style>
