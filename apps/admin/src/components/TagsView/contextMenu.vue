<template>
  <ul class="context-menu-container">
    <li @click="onRefreshClick">刷新</li>
    <li @click="onCloseOtherClick">关闭其他</li>
    <li @click="onCloseAllClick">关闭全部</li>
  </ul>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

const props = defineProps({
  index: {
    type: Number,
    default: -1
  }
})

const onCloseOtherClick = () => {
  appStore.removeTag(props.index, 'other')
}
const onCloseAllClick = () => {
  appStore.removeTag(props.index, 'all')
  router.push('/')
}
const onRefreshClick = () => {
  router.go(0)
}
</script>

<style scoped lang="less">
.context-menu-container {
  position: fixed;
  z-index: 3000;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  background: #fff;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  font-weight: 400;
  font-size: 12px;
  color: #333;
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
