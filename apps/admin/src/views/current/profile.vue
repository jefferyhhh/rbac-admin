<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { TabsInstance, UploadProps, FormInstance } from 'element-plus'
import { useUserInfo } from '@/stores/userInfo'
import storage from 'store'
import { updateCurrentUserInfo, changeCurrentUserPassword } from '@/api/user'
import _ from 'lodash'
import md5 from 'md5'

const tabPosition = ref<TabsInstance['tabPosition']>('left')
const ruleFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const storeUserInfo = useUserInfo()

const form = reactive({
  name: '',
  mobile: '',
  gender: '',
  email: '',
  username: '',
  roles: [] as string[],
  positions: [] as string[],
  avatar: '',
  dept_name: '',
  updateLoading: false
})
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

//上传头像url
const avatarAction = computed(() => {
  return import.meta.env.VITE_BASE_API + '/api/system/user/current/avatar/upload'
})
//header
const { accessToken } = storage.get('Access-Token')
const avatarHeaders = computed(() => {
  return {
    Authorization: 'Bearer ' + accessToken
  }
})

const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200) {
    ElMessage({
      message: '头像上传成功',
      type: 'success'
    })
    const newAvatar = import.meta.env.VITE_BASE_API + '/' + response.data
    form.avatar = newAvatar
  }
}
const onAvatarError: UploadProps['onError'] = (error) => {
  const msg = error?.message
  if (msg) {
    console.log(msg)

    ElMessage({
      message: '头像上传失败',
      type: 'error'
    })
  }
}
/**
 * 提交基本信息
 */
const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  form.updateLoading = true
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      const submitForm = {
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        gender: Number(form.gender),
        avatar: form.avatar
      }
      updateCurrentUserInfo(submitForm).then((res) => {
        if (res.code === 200) {
          ElMessage({
            message: '修改成功',
            type: 'success'
          })
          storeUserInfo.getUserInfo()
          form.updateLoading = false
        } else {
          ElMessage({
            message: res.message,
            type: 'error'
          })
          form.updateLoading = false
        }
      })
    } else {
      console.log('error submit!')
    }
  })
}

/**
 * 提交密码
 */
const passwordChanging = ref(false)
const onSubmitPassword = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        ElMessage({
          message: '两次输入的密码不一致',
          type: 'error'
        })
        return
      }

      passwordChanging.value = true
      const submitData = {
        old_password: md5(passwordForm.oldPassword),
        new_password: md5(passwordForm.newPassword)
      }
      changeCurrentUserPassword(submitData)
        .then((res) => {
          passwordChanging.value = false
          ElMessage({
            message: res.message,
            type: 'success'
          })
          initpasswordForm()
        })
        .catch((err) => {
          console.log(err)
          passwordChanging.value = false
        })
    } else {
      console.log('error submit!')
    }
  })
}
const initForm = () => {
  form.name = storeUserInfo.$state.basicInfo.name
  //gengder 是1就赋值‘男’，是2就赋值‘女’
  form.gender = storeUserInfo.$state.basicInfo.gender == 1 ? '1' : '2'
  //赋值电话、邮箱，如果不是空就赋值
  form.mobile = storeUserInfo.$state.basicInfo.mobile || ''
  form.email = storeUserInfo.$state.basicInfo.email || ''
  form.username = storeUserInfo.$state.basicInfo.username
  form.dept_name = storeUserInfo.$state.basicInfo.dept_name
  form.roles = storeUserInfo.$state.basicInfo.roles.map((item) => item.name)
  form.positions = storeUserInfo.$state.basicInfo.positions.map((item) => item.name)
  form.avatar = storeUserInfo.$state.basicInfo.avatar
}
const initpasswordForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}
onMounted(() => {
  initForm()
})
</script>

<template>
  <div class="container">
    <el-tabs :tab-position="tabPosition" class="demo-tabs">
      <el-tab-pane label="基本设置">
        <!-- 表单 -->
        <div class="info-container">
          <el-form
            ref="ruleFormRef"
            :model="form"
            status-icon
            label-width="auto"
            style="max-width: 600px"
          >
            <el-form-item
              label="姓名"
              prop="name"
              :rules="[{ required: true, message: '请输入姓名', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择您的性别">
                <el-option label="男" value="1" />
                <el-option label="女" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="form.mobile" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="form.username" disabled />
            </el-form-item>
            <el-form-item label="所属部门">
              <el-input v-model="form.dept_name" disabled />
            </el-form-item>
            <el-form-item label="所属岗位">
              <el-select multiple v-model="form.positions" disabled />
            </el-form-item>
            <el-form-item label="所属角色">
              <el-select multiple v-model="form.roles" disabled />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="form.updateLoading" @click="onSubmit(ruleFormRef)"
                >更新基本信息</el-button
              >
            </el-form-item>
          </el-form>
          <div class="avatar">
            <el-avatar :size="100" :src="form.avatar" />
            <div>
              <el-upload
                class="avatar-uploader"
                :action="avatarAction"
                :headers="avatarHeaders"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-error="onAvatarError"
              >
                <el-button>
                  上传头像<el-icon class="avatar-uploader-icon"><Upload /></el-icon>
                </el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!--  -->
      <el-tab-pane label="密码设置">
        <!-- element 修改密码表单 -->
        <div class="container">
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            status-icon
            label-width="auto"
            style="max-width: 600px"
          >
            <el-form-item
              label="旧密码"
              prop="oldPassword"
              :rules="[{ required: true, message: '请输入旧密码', trigger: ['blur', 'change'] }]"
            >
              <el-input
                v-model="passwordForm.oldPassword"
                autocomplete="off"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item
              label="新密码"
              prop="newPassword"
              :rules="[{ required: true, message: '请输入新密码', trigger: ['blur', 'change'] }]"
            >
              <el-input
                v-model="passwordForm.newPassword"
                autocomplete="off"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item
              label="确认密码"
              prop="confirmPassword"
              :rules="[
                { required: true, message: '请再次输入新密码', trigger: ['blur', 'change'] }
              ]"
            >
              <el-input
                v-model="passwordForm.confirmPassword"
                autocomplete="off"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="passwordChanging"
                @click="onSubmitPassword(passwordFormRef)"
                >更新密码</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="less" scoped>
.demo-tabs {
  height: 100%;
  > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
.container {
  background-color: #ffffff;
  padding: 50px;
  border-radius: 10px;
}
.info-container {
  display: flex;
  margin-left: 50px;
  .avatar {
    margin-left: 150px;
  }
}
</style>
