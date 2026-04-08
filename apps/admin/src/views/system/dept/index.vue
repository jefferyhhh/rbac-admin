<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import {
  getDeptList,
  getDeptDetail,
  updateDept,
  createDept,
  batchEnableDept,
  batchDisableDept,
  deleteDept
} from '@/api/dept'
import { menuToTree, toDeptTreeItem, toSelectorType } from '@/utils/menuToTree'
import type { FormInstance } from 'element-plus'

const tableLoading = ref(true)
const btnLoading = ref(false)

const dialogFormRef = ref<FormInstance>()

const deptList = ref<DeptTreeItem[]>([])
const ids = ref<number[]>([])
//弹出层可见性
const visible = ref(false)
const dialogTitle = ref('')

const initialMenuFormData = ref<DeptItem>({
  id: undefined,
  name: '',
  parent_id: 0,
  order: 1,
  description: '',
  available: true
})
const formData = ref({ ...initialMenuFormData.value })

const parentOptions = ref<SelectorType[]>([])

function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id)
}

const openDialog = (parentId?: number, deptId?: number) => {
  visible.value = true
  console.log(deptId, 'deptId')

  if (deptId) {
    dialogTitle.value = '编辑部门'

    getDeptDetail(deptId).then((res) => {
      formData.value = {
        ...res.data,
        parent_id: res.data.parent_id ?? 0,
        id: deptId
      }
    })
  } else {
    dialogTitle.value = '新增部门'
  }
}

const closeDialog = () => {
  visible.value = false
  formData.value = { ...initialMenuFormData.value }
}
/**
 * 增删改
 */
function handleDelete(menuId: number) {
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteDept({ id: menuId }).then((res) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
        }
        loadingData()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

const submitForm = () => {
  btnLoading.value = true

  dialogFormRef.value?.validate((isValid: boolean) => {
    const deptId = formData.value.id
    if (isValid) {
      if (deptId) {
        updateDept(formData.value).then((res) => {
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '修改成功'
            })
          }
          btnLoading.value = false
          closeDialog()
          loadingData()
        })
      } else {
        const body = {
          ...formData.value,
          parent_id: formData.value.parent_id == 0 ? null : formData.value.parent_id
        }

        createDept(body).then((res) => {
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '新增成功'
            })
          }
          btnLoading.value = false
          closeDialog()
          loadingData()
        })
      }
    } else {
      btnLoading.value = false
    }
  })
}

//下拉菜单
const handleCommand = (command: string | number | object) => {
  if (ids.value.length === 0) {
    ElMessage.warning('请选择数据')
    return
  }

  ElMessageBox.confirm(`确认${command === 'a' ? '停用' : '启用'}已选中的数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const body = { ids: ids.value }
      const batchApi = command === 'a' ? batchDisableDept(body) : batchEnableDept(body)
      batchApi
        .then(() => {
          ids.value = []
          loadingData()
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

const loadingData = () => {
  tableLoading.value = true
  getDeptList().then((res) => {
    deptList.value = menuToTree(res.data, toDeptTreeItem)
    parentOptions.value = [
      {
        label: '顶级部门',
        value: 0,
        children: menuToTree(res.data, toSelectorType)
      }
    ]

    tableLoading.value = false
  })
}

onMounted(() => loadingData())
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <el-button type="primary" :icon="Plus" @click="openDialog()">新增</el-button>
      <el-dropdown @command="handleCommand">
        <el-button plain>
          操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a"
              ><el-icon><CircleClose /></el-icon>批量停用</el-dropdown-item
            >
            <el-dropdown-item command="b"
              ><el-icon><CircleCheck /></el-icon>批量启用</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>

    <el-table
      v-loading="tableLoading"
      :data="deptList"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="部门名称" prop="name" />
      <el-table-column label="排序" prop="order" />
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
      <el-table-column label="备注" prop="description" />
      <el-table-column fixed="right" label="操作" width="220" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            link
            size="small"
            @click.stop="openDialog(undefined, scope.row.id)"
          >
            <el-icon><EditPen /></el-icon>编辑
          </el-button>
          <el-button type="danger" link size="small" @click.stop="handleDelete(scope.row.id)"
            ><el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 弹出层 -->
  <el-drawer v-model="visible" size="50%" :title="dialogTitle" @close="closeDialog">
    <el-form label-width="100px" :model="formData" ref="dialogFormRef">
      <el-form-item
        label="部门名称"
        prop="name"
        :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
      >
        <el-input v-model="formData.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="上级部门">
        <el-tree-select
          placeholder="选择上级部门"
          v-model="formData.parent_id"
          :data="parentOptions"
          :props="{ value: 'value', label: 'label', children: 'children' }"
          filterable
          check-strictly
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="formData.order" :min="1" controls-position="right" size="large" />
      </el-form-item>
      <el-form-item label="状态" prop="available">
        <el-radio-group v-model="formData.available">
          <el-radio :value="true">开启</el-radio>
          <el-radio :value="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.description" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="submitForm">确 定</el-button>
        <el-button @click="closeDialog()">取 消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.el-dropdown {
  margin-left: 12px;
}
</style>
