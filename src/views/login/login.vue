<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import type { loginFormType, captchaStateType } from './types'
import md5 from 'md5'
import { getCaptcha, login } from '@/api/user'
import type { FormInstance } from 'element-plus'
import { save_token } from '@/utils/storage'
import { useRouter } from 'vue-router'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const loginLoading = ref(false)
const form = reactive<loginFormType>({
  username: '',
  password: '',
  captcha: '',
  captcha_key: ''
})
const captchaState = reactive<captchaStateType>({
  key: '',
  img_base: ''
})
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
//登录
const onSubmitLogin = () => {
  loginLoading.value = true
  ruleFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      form.captcha_key = captchaState.key
      const submitData = {
        ...form,
        password: md5(form.password),
        captcha_key: captchaState.key
      }
      login(submitData)
        .then((res) => {
          const { access_token, refresh_token, expires_in } = res.data
          if (res.code == 200) {
            save_token(access_token, refresh_token, expires_in)
            loginLoading.value = false
            router.push('/')
          } else {
            loginLoading.value = false
          }
        })
        .catch((err) => {
          console.log(err, 'err')
          if (err.code == 401) {
            //重新获取验证码
            requestCaptcha()
            form.captcha = ''
          }
          loginLoading.value = false
        })
    } else {
      loginLoading.value = false
    }
  })
}
//获取验证码
const requestCaptcha = async () => {
  let { data: res, code } = await getCaptcha()
  if (code == 200) {
    captchaState.img_base = res.img_base
    captchaState.key = res.key
    console.log('getcode', res)
  }
}
onMounted(() => requestCaptcha())
</script>

<template>
  <div class="login-box">
    <el-form :model="form" ref="ruleFormRef" class="login-form" :rules="loginRules" status-icon>
      <h2 class="login-title">RBAC权限管理系统</h2>
      <el-form-item prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input placeholder="请输入密码" v-model="form.password" show-password type="password" />
      </el-form-item>
      <el-form-item prop="captcha" class="code-box">
        <el-input placeholder="验证码" v-model="form.captcha" class="code-input" />
        <div class="code-img" @click="requestCaptcha">
          <el-image :src="captchaState.img_base" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button class="form-btn" type="primary" :loading="loginLoading" @click="onSubmitLogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.login-box {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #ccc;
  .login-form {
    width: 350px;
    background-color: #fff;
    padding: 15px;
    height: 350px;
    border-radius: 20px;
    position: absolute;
    margin-top: -125px;
    margin-left: -175px;
    top: 50%;
    left: 50%;
  }
}
.login-title {
  color: #333;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 30px;
}
.code-box {
  position: relative;
  .code-img {
    width: 80px;
    height: 30px;
    position: absolute;
    right: 1px;
  }
}
.form-btn {
  width: 100%;
}
</style>
