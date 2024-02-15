<script lang="ts" setup>
import { asideCollStore } from '@/stores/asideColl'
//vite动态url，处理静态资源
const getImgScr = (avatar: string) => {
  return new URL(`../assets/${avatar}.png`, import.meta.url).href
}

const asideColl = asideCollStore()
const handleCollapse = () => {
  asideColl.updateCollapse()
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
      <h3>首页</h3>
    </div>
    <div class="r-content">
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
          <img class="user" :src="getImgScr('avatar')" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item><el-text class="mx-1" type="danger">退出</el-text></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #333;
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
</style>
