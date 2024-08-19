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
          <el-tag v-else-if="scope.row.type === 3" type="primary">权限</el-tag>
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
            type="primary"
            link
            size="small"
            @click.stop="openDialog(scope.row.id)"
          >
            <el-icon><Plus /></el-icon>新增
          </el-button>

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
  <el-drawer
    v-model="dialog.visible"
    size="50%"
    :title="dialog.title"
    @close="closeDialog(dialogFormRef)"
  >
    <el-form :model="formData" ref="dialogFormRef" label-width="100px">
      <el-form-item
        label="父级菜单"
        prop="parent_id"
        :rules="[{ required: true, message: '请选择上级菜单', trigger: 'change' }]"
      >
        <el-tree-select
          v-model="formData.parent_id"
          placeholder="选择上级菜单"
          :data="parentOptions"
          :props="{ value: 'value', label: 'label', children: 'children' }"
          filterable
          check-strictly
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item
        label="名称"
        prop="name"
        :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
      >
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item
        label="类型"
        prop="type"
        v-if="dialog.title == '新增菜单'"
        :rules="[
          {
            required: dialog.title == '新增菜单' ? true : false,
            message: '请选择类型',
            trigger: 'blur'
          }
        ]"
      >
        <el-radio-group v-model="formData.type">
          <el-radio :value="1">目录</el-radio>
          <el-radio :value="2">功能</el-radio>
          <el-radio :value="3">权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="formData.type !== 1"
        label="权限标识"
        prop="permission"
        :rules="[{ required: formData.type !== 1 ? true : false, message: '请输入权限标识' }]"
      >
        <el-input v-model="formData.permission" placeholder="请输入权限标识" />
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="formData.order" :min="1" controls-position="right" size="large" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <IconPicker :iconsNameList="iconNameList" v-model="formData.icon" />
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="formData.description" />
      </el-form-item>
      <div v-if="formData.type !== 3">
        <el-divider content-position="center">以下是前端配置项</el-divider>
        <el-form-item
          label="路由名称"
          prop="route_name"
          :rules="[{ required: formData.type !== 3 ? true : false, message: '请输入路由名称' }]"
        >
          <el-input v-model="formData.route_name" />
        </el-form-item>
        <el-form-item
          label="路由路径"
          prop="route_path"
          :rules="[{ required: formData.type !== 3 ? true : false, message: '请输入路由路径' }]"
        >
          <el-input v-model="formData.route_path" />
        </el-form-item>
        <el-form-item
          v-if="formData.type == 1"
          label="重定向"
          prop="redirect"
          :rules="[{ required: formData.type === 1 ? true : false, message: '请输入重定向' }]"
        >
          <el-input v-model="formData.redirect" />
        </el-form-item>
        <el-form-item
          v-if="formData.type == 2"
          label="组件地址"
          prop="component_path"
          :rules="[{ required: formData.type === 2 ? true : false, message: '请输入组件地址' }]"
        >
          <el-input v-model="formData.component_path" />
        </el-form-item>
        <el-form-item
          label="页面缓存"
          prop="cache"
          :rules="[{ required: formData.type !== 3 ? true : false, message: '请选择缓存状态' }]"
        >
          <el-radio-group v-model="formData.cache">
            <el-radio :value="true">开启</el-radio>
            <el-radio :value="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="隐藏"
          prop="hidden"
          :rules="[{ required: formData.type !== 3 ? true : false, message: '请选择隐藏状态' }]"
        >
          <el-radio-group v-model="formData.hidden">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="closeDialog(dialogFormRef)">取 消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { getMenuList, getMenuDetail, createMenu, updateMenu, deleteMenu } from '@/api/menu'
import { onMounted, reactive, ref } from 'vue'
import { listToTree, listToTree2 } from '@/utils/util'
import type { FormInstance } from 'element-plus'
import { iconNameList } from '@/main'
import IconPicker from '@/components/IconPicker.vue'
import _ from 'lodash'

//修改类型，id可忽略
type myMenuItem = Omit<MenuItem, 'id'> & { id?: number }

const tableTreeData = ref<MenuTreeItem[]>([])

const memuSelectorTree = ref<MenuTreeItem[]>([])
const parentOptions = ref<SelectorType[]>([])

const dialogFormRef = ref<FormInstance>()

const dialog = reactive({
  title: '',
  visible: false
})
//按钮Loading
const loading = ref(false)

const initialMenuFormData = ref<myMenuItem>({
  cache: true,
  component_path: '',
  description: '',
  hidden: false,
  icon: '',
  id: undefined,
  name: '',
  order: 1,
  parent_id: 0,
  permission: '',
  redirect: '',
  route_name: '',
  route_path: '',
  type: 1
})
const formData = ref({ ...initialMenuFormData.value })

function handleDelete(menuId: number) {
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteMenu({ id: menuId }).then((res) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
        }
        loadData()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
//提交表单
function submitForm() {
  loading.value = true
  dialogFormRef.value?.validate((isValid: boolean) => {
    const menuId = formData.value.id
    if (isValid) {
      if (menuId) {
        updateMenu(handleSubmitBody(menuId) as MenuItem)
          .then(() => {
            loading.value = false
            ElMessage.success('修改成功')
            closeDialog(dialogFormRef.value)
            loadData()
          })
          .catch((error) => {
            console.log(error)
            loading.value = false
          })
      } else {
        createMenu(handleSubmitBody(menuId))
          .then(() => {
            loading.value = false
            ElMessage.success('添加成功')
            closeDialog(dialogFormRef.value)
            loadData()
          })
          .catch((error) => {
            console.log(error)
            loading.value = false
          })
      }
    }
  })
}
/** 打开弹出层 */
function openDialog(parentId?: number, menuId?: number) {
  dialog.visible = true
  if (menuId) {
    dialog.title = '编辑菜单'
    getMenuDetail(menuId).then((res) => {
      formData.value = {
        ...res.data,
        parent_id: res.data.parent_id ?? 0
      }
      initialMenuFormData.value = {
        ...res.data,
        parent_id: res.data.parent_id ?? 0
      }
    })
  } else {
    dialog.title = '新增菜单'
    formData.value.parent_id = parentId
  }
}
/** 关闭弹出层 */
function closeDialog(formEl: FormInstance | undefined) {
  console.log('closeDialog', formEl)

  dialog.visible = false
  if (!formEl) return

  formEl.resetFields()
}
//处理提交内容
function handleSubmitBody(menuId: number | undefined) {
  const submitBody = _.cloneDeep(formData.value)
  // 如果没有id(新建菜单)，则删除id字段
  if (!menuId) {
    delete submitBody.id
  }
  let keysToDelete: (keyof MenuItem)[] = []
  switch (submitBody.type) {
    case 1:
      keysToDelete = ['permission', 'component_path', 'created_at', 'updated_at']
      keysToDelete.forEach((prop) => {
        delete submitBody[prop]
      })
      return submitBody
    case 2:
      keysToDelete = ['redirect', 'created_at', 'updated_at']
      keysToDelete.forEach((prop) => {
        delete submitBody[prop]
      })
      return submitBody
    case 3:
      keysToDelete = [
        'redirect',
        'created_at',
        'updated_at',
        'component_path',
        'route_path',
        'route_name'
      ]
      keysToDelete.forEach((prop) => {
        delete submitBody[prop]
      })
      return submitBody
    default:
      return submitBody
  }
}

/** 生命周期 */
onMounted(() => {
  loadData()
})
const loadData = () => {
  getMenuList().then((res) => {
    tableTreeData.value = listToTree(res.data)
    memuSelectorTree.value = listToTree(res.data.filter((item) => item.type !== 3))
    parentOptions.value = [
      {
        value: 0,
        label: '顶级菜单',
        children: listToTree2(res.data.filter((item) => item.type !== 3))
      }
    ]
  })
}
</script>

<style scoped>
/* 添加样式 */
</style>
