<script lang="ts" setup>
interface CrumbProps {
  separator?: string
  separatorIcon?: string
  crumbItemList: {
    to: { path: string; [index: string]: any } // 和路由的 to 很相似
    replace?: boolean
    name: string
  }[]
}
const crumbProps = defineProps<CrumbProps>()
</script>

<template>
  <el-breadcrumb
    :separator="crumbProps.separator"
    :separator-icon="crumbProps.separatorIcon"
    style="padding: 0.5rem 0"
    class="bread"
  >
    <!-- <el-breadcrumb-item :to="{ path: '/' }" >首页</el-breadcrumb-item> -->
    <el-breadcrumb-item
      v-for="item in crumbProps.crumbItemList"
      :key="item.name"
      :to="item.to"
      :replace="item.replace"
    >
      <slot>{{ item.name }}</slot>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
