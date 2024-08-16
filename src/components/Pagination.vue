<script setup lang="ts">
import type { PropType } from 'vue'
defineProps({
  hidden: {
    type: Boolean,
    default: false
  },
  total: {
    required: true,
    type: Number as PropType<number>,
    default: 0
  },
  // page: {
  //   type: Number,
  //   default: 1
  // },
  // limit: {
  //   type: Number,
  //   default: 20
  // },
  pageSizes: {
    type: Array as PropType<number[]>,
    default() {
      return [10, 20, 30, 50]
    }
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  }
})
//defineModel:较新的特性
const currentPage = defineModel('currentPage')
const pageSize = defineModel('pageSize')

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
}

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage
}
</script>

<template>
  <div :class="{ hidden: hidden }" class="pagination">
    <el-pagination
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped lang="less">
.pagination {
  padding: 12px;

  &.hidden {
    display: none;
  }
}
</style>
