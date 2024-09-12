<template>
  <div>
    <div class="search-bar">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="queryForm.date"
            type="daterange"
            range-separator="→"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleResetQuery"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- table -->
    <el-card shadow="never">
      <el-table
        :data="tableData"
        highlight-current-row
        border
        show-overflow-tooltip
        v-loading="tableLoading"
      >
        <el-table-column type="index" width="50" />
        <el-table-column label="操作时间" prop="created_at" width="160" />
        <el-table-column label="请求地址" prop="request_path" width="240" />
        <el-table-column label="IP地址" prop="request_ip" width="140" />
        <el-table-column label="浏览器" prop="request_browser" width="180" />
        <el-table-column label="终端系统" prop="request_os" width="180" />
        <el-table-column label="返回信息" prop="response_json" width="360" />
      </el-table>
    </el-card>
    <Pagination
      v-if="total > 0"
      v-model:total="total"
      v-model:current-page="current_page"
      v-model:page-size="page_size"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getLogList, type logDataType } from '@/api/log'

interface searchDataType {
  request_path?: string
  creator?: number
  creator_name?: string
  date?: [string, string]
}

const queryForm: searchDataType = reactive({})
const tableLoading = ref(false)

const current_page = ref(1)
const page_size = ref(10)
const total = ref(0)

const tableData = ref<logDataType[]>([])
const handleQuery = () => {
  current_page.value = 1
  loadingData()
}
const handleResetQuery = () => {
  if (!queryForm) return
  Object.keys(queryForm).forEach((key) => {
    delete queryForm[key as keyof searchDataType]
  })
  // queryForm = {}
  current_page.value = 1
  loadingData()
}

const loadingData = () => {
  tableLoading.value = true
  let params: any = {}

  if (queryForm.request_path) {
    params['request_path'] = queryForm.request_path
  }
  if (queryForm.creator) {
    params['creator'] = queryForm.creator
  }
  if (queryForm.creator_name) {
    params['creator_name'] = queryForm.creator_name
  }
  if (queryForm.date) {
    params['start_time'] = `${queryForm.date[0]} 00:00:00`
    params['end_time'] = `${queryForm.date[1]} 23:59:59`
  }
  params['page'] = current_page.value
  params['page_size'] = page_size.value

  getLogList(params)
    .then((res) => {
      tableData.value = res.data
      total.value = res.total
    })
    .finally(() => {
      tableLoading.value = false
    })
}
function disabledDate(date: Date) {
  // 禁止选择今天以后的日期
  return date.getTime() > Date.now()
}

// 监听 currentPage 和 pageSize 的变化
watch([current_page, page_size], () => {
  loadingData()
})
onMounted(() => loadingData())
</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
.search-bar {
  padding: 24px 10px 6px 10px;
  margin: 15px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.2);
}
</style>
