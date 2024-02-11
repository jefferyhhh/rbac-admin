<script lang="ts" setup>
const list = [
  {
    path: '/user',
    name: 'name',
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
        path: 'page1',
        name: 'page1',
        label: '页面一',
        icon: 'setting',
        url: 'Other/PageOne'
      },
      {
        path: 'page1',
        name: 'page1',
        label: '页面一',
        icon: 'setting',
        url: 'Other/PageOne'
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
  <el-aside width="200px">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      :collapse="false"
    >
      <el-menu-item :index="item.path" :key="item.path" v-for="item in noChildren()">
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
}
</style>
