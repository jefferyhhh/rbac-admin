<template>
  <!-- table -->
  <el-card shadow="never">
    <template #header>
      <el-button type="primary" :icon="Plus" @click="openRoleDialog(undefined)">新增</el-button>
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

    <el-table v-loading="tableLoading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色名称" prop="name" min-width="100" />
      <el-table-column label="排序" prop="order" min-width="100" align="center" sortable />
      <el-table-column label="状态" align="center" sortable>
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
          <el-button type="primary" link size="small" @click.stop="openPermissionDrawer(scope.row)">
            <el-icon><Coordinate /></el-icon>授权
          </el-button>

          <el-button type="primary" link size="small" @click.stop="openRoleDialog(scope.row.id)"
            ><el-icon><EditPen /></el-icon>编辑
          </el-button>
          <el-button type="danger" link size="small" @click.stop="deleteRow(scope.row.id)"
            ><el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <Pagination
    v-if="total > 0"
    v-model:total="total"
    v-model:current-page="current_page"
    v-model:page-size="page_size"
  />

  <!-- dialog -->
  <el-dialog v-model="roleVisible" :title="dialogTitle" width="500" @close="closeRoleDialog">
    <el-form :model="roleForm" ref="roleRef" label-position="left" label-width="80px">
      <el-form-item
        label="角色名称"
        prop="name"
        :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
      >
        <el-input v-model="roleForm.name" clearable />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number :min="1" v-model="roleForm.order" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="roleForm.description"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="roleVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRoleForm"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 授权抽屉 -->
  <el-drawer v-model="drawerVisible" size="800" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h1 :id="titleId" :class="titleClass">
        <el-icon class="closeIcon"><Close @click="close" /></el-icon>
      </h1>
      <el-button type="primary" v-loading="defaultLoading" @click="handlePermissionSave">
        保存
      </el-button>
    </template>
    <div style="width: 700px; height: 100%">
      <el-row :gutter="10">
        <el-col :span="8">
          <div style="display: flex; margin-bottom: 12px">
            <div
              style="width: 10px; height: 21px; margin-right: 10px; background-color: #1677ff"
            ></div>
            <span style="font-size: 16px">数据授权</span>
            <el-tooltip placement="bottom">
              <template #content>
                <span>授权用户可操作的数据范围</span>
              </template>
              <QuestionFilled style="width: 1em; height: 1em; margin-left: 8px" />
            </el-tooltip>
          </div>
          <el-select v-model="permissionData.data_scope">
            <el-option label="仅本人数据权限" :value="1" />
            <el-option label="本部门数据权限" :value="2" />
            <el-option label="本部门及以下数据权限" :value="3" />
            <el-option label="全部数据权限" :value="4" />
            <el-option label="自定义数据权限" :value="5" />
          </el-select>
          <div style="margin-top: 20px" v-if="permissionData.data_scope === 5">
            <el-tree
              :data="deptTreeOptions"
              ref="deptTreeRef"
              node-key="value"
              show-checkbox
              :default-expand-all="true"
              check-strictly
              :default-checked-keys="permissionData.dept_ids"
            />
          </div>
        </el-col>
        <el-col :span="16">
          <div style="display: flex; margin-bottom: 12px">
            <div
              style="width: 10px; height: 21px; margin-right: 10px; background-color: #1677ff"
            ></div>
            <span style="font-size: 16px">菜单授权</span>
            <el-tooltip placement="bottom">
              <template #content>
                <span>授权用户在菜单中可操作的范围</span>
              </template>
              <QuestionFilled style="width: 1em; height: 1em; margin-left: 8px" />
            </el-tooltip>
          </div>
          <el-scrollbar height="650px">
            <el-tree
              v-loading="defaultLoading"
              ref="menuTreeRef"
              :data="menuTreeOptions"
              node-key="value"
              show-checkbox
              :default-checked-keys="permissionData.menu_ids"
            />
          </el-scrollbar>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  batchDisableRole,
  batchEnableRole,
  getRoleList,
  createRole,
  deleteRole,
  updateRole,
  getRolePermission,
  setPermission,
  type roleListType,
  type permissionDataType
} from '@/api/role'
import { getMenuOptions } from '@/api/menu'
import { getDeptOptions } from '@/api/dept'

import { onMounted, ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, ElTree } from 'element-plus'
import type { roleFormType } from './types'
import { menuToTree, toMenuTreeItem, toSelectorType } from '@/utils/menuToTree'

const defaultLoading = ref(false)

const tableLoading = ref(false)
const tableData = ref<roleListType[]>([])
const ids = ref<number[]>([])
const dialogTitle = ref('')
//授权抽屉
const drawerVisible = ref(false)
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const deptTreeRef = ref<InstanceType<typeof ElTree>>()
const permissionData = ref<permissionDataType>({})
const menuTreeData = ref<MenuTreeItem[]>([])
const menuTreeOptions = ref<SelectorType[]>([])
const deptTreeOptions = ref<SelectorType[]>([])

//分页
const current_page = ref(1)
const page_size = ref(10)
const total = ref(0)

//新增
const roleVisible = ref(false)
const roleRef = ref<FormInstance>()

const roleForm = ref<roleFormType>({
  id: undefined,
  name: '',
  order: 0,
  description: ''
})
//角色弹窗
const closeRoleDialog = () => {
  roleRef.value?.resetFields()
}
const openRoleDialog = (roleId?: number) => {
  roleVisible.value = true

  if (roleId) {
    dialogTitle.value = '编辑角色'
    const role = tableData.value.find((item) => item.id === roleId)
    if (role) {
      roleForm.value = {
        id: role.id,
        name: role.name!!,
        order: role.order!!,
        description: role.description,
        available: role.available
      }
    }
  } else {
    dialogTitle.value = '新增角色'
  }
}
//提交角色表单
const submitRoleForm = () => {
  roleRef.value?.validate((valid) => {
    const role_id = roleForm.value.id

    if (valid) {
      roleVisible.value = false
      if (role_id) {
        //编辑
        updateRole(roleForm.value).then((res) => {
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '编辑成功'
            })
          }
          loadingData()
        })
      } else {
        //新增
        createRole(roleForm.value).then((res) => {
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '新增成功'
            })
          }
          loadingData()
        })
      }
    }
  })
}

//打开授权抽屉
const openPermissionDrawer = (row: roleListType) => {
  if (!row.id) {
    return
  }

  drawerVisible.value = true
  defaultLoading.value = true

  //init
  menuTreeOptions.value = []
  deptTreeOptions.value = []
  permissionData.value = {}
  permissionData.value = {
    menu_ids: [],
    dept_ids: [],
    role_ids: row ? [row.id] : [],
    data_scope: row ? row.data_scope : 1
  }
  getDeptOptions()
    .then((res) => {
      const result = res.data
      deptTreeOptions.value = menuToTree(result, toSelectorType)
    })
    .catch((err) => {
      console.log(err)
    })
  getMenuOptions()
    .then((res) => {
      const result = res.data
      menuTreeData.value = menuToTree(result, toMenuTreeItem)
      menuTreeOptions.value = menuToTree(result, toSelectorType)
      defaultLoading.value = false
    })
    .catch((err) => {
      console.log(err)
      defaultLoading.value = false
    })

  getRolePermission(row.id).then((res) => {
    const temp = res.data
    permissionData.value.menu_ids = temp.menus.map((item: any) => item.id)
    permissionData.value.dept_ids = temp.depts.map((item: any) => item.id)
  })
}
//保存授权
const handlePermissionSave = () => {
  defaultLoading.value = true

  /* 
  const checkedMenuIds: number[] = menuTreeRef
    .value!.getCheckedNodes(false, true)
    .map((node: any) => node.value)
  console.log(checkedMenuIds, 'checkedMenuIds')
  */
  const checkedMenuIds = menuTreeRef.value!.getCheckedKeys() as number[]
  let submitData = { ...permissionData.value, menu_ids: checkedMenuIds }

  if (permissionData.value.data_scope === 5) {
    const checkedDeptIds = deptTreeRef.value!.getCheckedKeys() as number[]
    submitData = { ...submitData, dept_ids: checkedDeptIds }
  }

  setPermission(submitData)
    .then(() => {
      defaultLoading.value = false
      drawerVisible.value = false
      ElMessage({
        type: 'success',
        message: '授权成功'
      })
    })
    .catch((err) => {
      console.log(err)
      defaultLoading.value = false
    })
}

//删除角色
const deleteRow = (rowId: number) => {
  deleteRole({ id: rowId }).then((res) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    }
    loadingData()
  })
}
// 获取数据
const loadingData = () => {
  tableLoading.value = true
  let params: any = {}

  params['page'] = current_page.value
  params['page_size'] = page_size.value

  getRoleList(params).then((res) => {
    tableLoading.value = false
    tableData.value = res.data
  })
}

function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id)
}
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
      const batchApi = command === 'a' ? batchDisableRole(body) : batchEnableRole(body)
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

// 监听 currentPage 和 pageSize 的变化
watch([current_page, page_size], () => {
  loadingData()
})
onMounted(() => loadingData())
</script>

<style scoped>
.el-dropdown {
  margin-left: 12px;
  display: none; /* 先隐藏，后端有问题 */
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
/* 授权抽屉 */
.closeIcon {
  font-size: 20px;
}
.el-col-8 {
  /* 灰色细边框 */
  border-right: 1px solid #dcdfe6;
}
</style>
