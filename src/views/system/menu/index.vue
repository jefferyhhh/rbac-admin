<template>
  <el-card shadow="never">
    <el-table :data="tableTreeData" style="width: 100%" row-key="id" highlight-current-row>
      <el-table-column label="菜单名称" min-width="150">
        <template #default="scope">
          <el-button text v-if="scope.row.icon" :icon="scope.row.icon" circle />
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="order" align="center" label="显示排序" />
      <el-table-column label="菜单类型" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 1" type="success">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 2" type="warning">功能</el-tag>
          <el-tag v-else-if="scope.row.type === 3" type="info">权限</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="组件路径">
        <template #default="scope">
          <span v-if="scope.row.component_path">{{ scope.row.component_path }}</span>
          <span v-else>MainLayout</span>
        </template>
      </el-table-column>
      <el-table-column prop="permission" label="权限标识" />
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <span
            ><el-badge
              style="margin-right: 5px"
              is-dot
              :color="scope.row.available ? 'chartreuse' : 'red'"
            />{{ scope.row.available ? '启用' : '禁用' }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="description" label="备注" align="center" />
      <el-table-column fixed="right" label="操作" width="220" align="center">
        <template #default="scope">
          <el-button
            v-if="scope.row.type == 1 || scope.row.type == 2"
            v-hasPerm="['sys:menu:add']"
            type="primary"
            link
            size="small"
          >
            <el-icon><Plus /></el-icon>新增
          </el-button>

          <el-button v-hasPerm="['sys:menu:edit']" type="primary" link size="small">
            <el-icon><EditPen /></el-icon>编辑
          </el-button>
          <el-button v-hasPerm="['sys:menu:delete']" type="danger" link size="small"
            ><el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { getMenuList } from '@/api/menu'
import { onMounted, reactive, ref } from 'vue'
import { listToTree } from '@/utils/util'

const tableTreeData = ref<MenuTreeItem[]>([])
onMounted(() => {
  loadData()
})
const loadData = () => {
  getMenuList().then((res) => {
    tableTreeData.value = listToTree(res.data)
  })
}
</script>

<style scoped>
/* 添加样式 */
</style>
