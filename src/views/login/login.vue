<script lang="ts" setup>
import { reactive, onMounted, type ComponentInternalInstance, getCurrentInstance } from 'vue'
import type { loginFormType, captchaStateType } from './types'
const { proxy } = getCurrentInstance() as ComponentInternalInstance

const form = reactive({
  username: '',
  password: '',
  captcha: ''
})
const captchaState = reactive<captchaStateType>({
  enable: true,
  key: '',
  img_base:
    'data:image/png;base64,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'
})
const onSubmitLogin = () => {
  console.log('登录')
}
const requestCaptcha = async () => {
  let res = await proxy?.$api.getCaptcha()
  console.log(res, 537)
}
onMounted(() => requestCaptcha())
</script>

<template>
  <div class="login-box">
    <el-form :model="form" ref="form" class="login-form">
      <h2 class="login-title">vue+Echarts后台管理系统</h2>
      <el-form-item>
        <el-input placeholder="请输入用户名" v-model="form.username" />
      </el-form-item>
      <el-form-item>
        <el-input placeholder="请输入密码" v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item class="code-box">
        <el-input placeholder="验证码" v-model="form.captcha" class="code-input" />
        <div class="code-img">
          <el-image :src="captchaState.img_base" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button class="form-btn" type="primary" @click="onSubmitLogin">登录</el-button>
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
