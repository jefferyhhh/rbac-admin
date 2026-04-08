<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
import { computed, ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const app_store = useAppStore()
const TagsViewList = computed<TagView[]>(() => {
  return app_store.$state.tagsViewList
})

const route = useRoute()
//是否被选中
const isActive = (tag: TagView) => {
  return tag.path === route.path
}
//是否固定(首页)
const isAffix = (tag: TagView) => {
  const affixList = ['Workplace']
  return affixList.includes(tag.name as string)
}

//点击关闭
const router = useRouter()
const onCloseClick = (index: number, tag: TagView) => {
  app_store.removeTag(index, 'self')

  // 如果删除的是当前页面，自动定位到上一个页面
  if (isActive(tag)) {
    const lastTag = TagsViewList.value[index - 1]
    if (lastTag) {
      router.push(lastTag.fullPath)
    } else {
      router.push('/')
    }
  }
}

/**
 * contextMenu
 */
const selectIndex = ref(-1)
const visible = ref(false)
const menuStyle = reactive<{ left: string; top: string }>({
  left: '0',
  top: '0'
})
const openMenu = (e: MouseEvent, index: number) => {
  const { clientX, clientY } = e
  menuStyle.left = `${clientX}px`
  menuStyle.top = `${clientY}px`
  visible.value = true
  selectIndex.value = index
}

const closeMenu = () => {
  visible.value = false
}
watch(
  visible,
  (val) => {
    if (val) {
      document.body.addEventListener('click', closeMenu)
    } else {
      document.body.removeEventListener('click', closeMenu)
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper">
      <router-link
        v-for="(tag, index) in TagsViewList"
        :key="tag.fullPath"
        :to="{ path: tag.fullPath }"
        class="tags-view-item"
        :class="isActive(tag) ? 'active' : ''"
        @contextmenu.prevent="openMenu($event, index)"
      >
        {{ tag.title }}
        <template v-if="!isAffix(tag)">
          <Close class="el-icon-close" @click.prevent.stop="onCloseClick(index, tag)" />
        </template>
      </router-link>
    </el-scrollbar>
    <div class="contextmenu-container">
      <context-menu v-show="visible" :style="menuStyle" :index="selectIndex" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.tags-view-container {
  border-bottom: 1px solid #d8dce5;
  width: 100%;
  height: 34px;
  background: #fff;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-item {
    display: inline-block;
    position: relative;
    margin-left: 5px;
    margin-top: 4px;
    padding: 0 8px;
    border: 1px solid #d8dce5;
    height: 26px;
    background: #fff;
    cursor: pointer;
    line-height: 26px;
    font-size: 12px;
    color: #495060;
    border-radius: 7px 7px 0 0;
    &.active {
      color: #fff;
      background-color: #4a80ee;
      &::before {
        display: inline-block;
        position: relative;
        margin-right: 4px;
        border-radius: 50%;
        width: 5px;
        height: 5px;
        background: #fff;
        content: '';
      }
    }
    // close 按钮
    .el-icon-close {
      border-radius: 50%;
      width: 1em;
      height: 1em;
      line-height: 10px;
      vertical-align: -2px;
      text-align: center;
      transform-origin: 100% 50%;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      &::before {
        display: inline-block;
        vertical-align: -3px;
        transform: scale(0.6);
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
