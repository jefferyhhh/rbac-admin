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
    <el-table :data="tableData" row-key="id" highlight-current-row show-overflow-tooltip>
      <el-table-column type="selection" width="35" />
      <el-table-column label="编号" prop="id" align="center" />
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="部门" prop="dept_name" />
      <el-table-column label="角色" prop="roleNames" />
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
          <el-button type="primary" link size="small" @click.stop="openDialog(scope.row.id)">
            <el-icon><EditPen /></el-icon>编辑
          </el-button>
          <el-button type="danger" link size="small" @click.stop="handleDelete(scope.row.id)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-if="total > 0"
      v-model:total="total"
      v-model:current-page="current_page"
      v-model:page-size="page_size"
    />
  </el-card>

  <!-- 弹出层 -->
  <el-drawer v-model="visible" size="50%" :title="dialogTitle" @close="closeDialog(dialogFormRef)">
    <el-form label-width="100px" :model="formData" ref="dialogFormRef">
      <el-form-item
        label="用户名"
        prop="username"
        :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
      >
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item
        label="姓名"
        prop="name"
        :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item
        label="部门"
        prop="dept_id"
        :rules="[{ required: true, message: '请选择部门', trigger: 'blur' }]"
      >
        <el-tree-select
          :data="deptTreeOptions"
          v-model="formData.dept_id"
          placeholder="请选择部门"
          terable
          check-strictly
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="角色">
        <el-select filterable multiple v-model="formData.role_ids">
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="!item.available"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位">
        <el-select filterable multiple v-model="formData.position_ids">
          <el-option
            v-for="item in positionOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="!item.available"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="性别"
        prop="gender"
        :rules="[{ required: true, message: '请选择性别', trigger: 'blur' }]"
      >
        <el-radio-group v-model="formData.gender">
          <el-radio :value="1">男</el-radio>
          <el-radio :value="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dialogTitle == '编辑用户'" label="状态" prop="available">
        <el-radio-group v-model="formData.available">
          <el-radio :value="true">启用</el-radio>
          <el-radio :value="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否为超管"
        prop="is_superuser"
        :rules="[{ required: true, message: '请选择是否为超管', trigger: 'blur' }]"
      >
        <el-radio-group v-model="formData.is_superuser">
          <el-radio :value="true">是</el-radio>
          <el-radio :value="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="修改密码" v-if="!showPasswordInput && dialogTitle == '编辑用户'">
        <el-checkbox size="large" v-model="showPasswordInput" />
      </el-form-item>
      <el-form-item
        label="密码"
        v-if="showPasswordInput || dialogTitle == '新增用户'"
        prop="password"
        :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
      >
        <el-input type="password" show-password v-model="formData.password" />
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input clearable v-model="formData.mobile" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input clearable v-model="formData.email" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="formData.description"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
        <el-button @click="closeDialog(dialogFormRef)">取 消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import _ from 'lodash'
import md5 from 'md5'
import { menuToTree, toSelectorType } from '@/utils/menuToTree'
import { getDeptOptions } from '@/api/dept'
import { getPositionOptions, type positionItem } from '@/api/position'
import { getRoleOptions, type roleListType } from '@/api/role'
import {
  getUserList,
  getUserDetail,
  deleteUser,
  createUser,
  updateUser,
  type userListType
} from '@/api/user'

//分页
const current_page = ref(1)
const page_size = ref(10)
const total = ref(0)

const formData = ref<userListType>({})
const tableData = ref<userListType[]>([])
const loading = ref(false)
const dialogFormRef = ref<FormInstance>()

//弹出层
const visible = ref(false)
const dialogTitle = ref('')
const deptTreeOptions = ref<SelectorType[]>([])
const roleOptions = ref<roleListType[]>([])
const positionOptions = ref<positionItem[]>([])
const showPasswordInput = ref(false)

/* 弹出层 */
const closeDialog = (formEl: FormInstance | undefined) => {
  visible.value = false
  if (!formEl) return

  formEl.resetFields()
}
const openDialog = (userId?: number) => {
  visible.value = true

  if (userId) {
    dialogTitle.value = '编辑用户'
    getUserDetail(userId).then((res) => {
      const result = res.data
      formData.value = result
      formData.value.role_ids = result.roles
        ? result.roles.map((item) => item.id as number)
        : undefined
      formData.value.position_ids = result.positions
        ? result.positions.map((item) => item.id as number)
        : undefined
    })
  } else {
    dialogTitle.value = '新增用户'
  }
}

/* header下拉菜单 */
const handleCommand = (command: string | number | object) => {
  console.log(command)
}
/* 获取数据 */
const loadingData = () => {
  getDeptOptions().then((res) => {
    deptTreeOptions.value = menuToTree(res.data, toSelectorType)
  })

  getPositionOptions().then((res) => {
    positionOptions.value = res.data
  })
  getRoleOptions().then((res) => {
    roleOptions.value = res.data
  })

  getUserList({ page: 1, page_size: 10 }).then((res) => {
    const result = res.data
    tableData.value = result.map((item) => {
      item.roleNames = item.roles ? item.roles.map((item) => item.name).join('，') : undefined

      item.creatorName = item.creator?.name
      return item
    })
  })
}
/* 删除 */
const handleDelete = (uid: number) => {
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteUser({ id: uid })
        .then(() => {
          loadingData()
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
/* 提交表单 */
const submitForm = () => {
  loading.value = true

  dialogFormRef.value?.validate((isValid: boolean) => {
    const uid = formData.value.id
    const submitBody: userListType = _.pick(formData.value, [
      'username',
      'name',
      'dept_id',
      'role_ids',
      'position_ids',
      'gender',
      'email',
      'mobile',
      'available',
      'description',
      'is_superuser',
      'password'
    ])
    if (isValid) {
      if (uid) {
        submitBody.id = formData.value.id
        if (showPasswordInput.value && formData.value.password) {
          submitBody.password = md5(formData.value.password!)
        }
        updateUser(submitBody).then((res) => {
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '修改成功'
            })
          }
          loading.value = false
          loadingData()
          closeDialog(dialogFormRef.value)
        })
      } else {
        submitBody.password = md5(formData.value.password!)
        console.log(submitBody)

        createUser(submitBody).then((res) => {
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '新增成功'
            })
          }
          loading.value = false
          loadingData()
          closeDialog(dialogFormRef.value)
        })
      }
    }
  })
}

onMounted(() => {
  loadingData()
})
</script>

<style scoped>
.el-dropdown {
  margin-left: 12px;
}
</style>
