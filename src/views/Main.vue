<script lang="ts" setup>
import CommonHeader from '../components/CommonHeader.vue'
import CommonAside from '../components/CommonAside.vue'
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
      background: #545c64;
    }
  }
}
</style>
