<script lang="ts" setup>
import { reactive, onMounted, ref, h } from 'vue'
import type { loginFormType, captchaStateType } from './types'
import md5 from 'md5'
import { getCaptcha, login } from '@/api/user'
import type { FormInstance } from 'element-plus'
import { save_token } from '@/utils/storage'
import { useRouter } from 'vue-router'

// 内联 SVG icon 组件
const UserIcon = {
  render: () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '12', cy: '7', r: '4' })
    ])
}
const LockIcon = {
  render: () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }),
      h('path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' })
    ])
}
const ShieldIcon = {
  render: () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
    ])
}

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

          loginLoading.value = false
          requestCaptcha()
          form.captcha = ''
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
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-overlay" />
    <div class="bg-shapes">
      <span class="shape shape-1" />
      <span class="shape shape-2" />
      <span class="shape shape-3" />
    </div>

    <!-- 卡片 -->
    <div class="login-card">
      <!-- 左侧品牌区 -->
      <div class="card-brand">
        <div class="brand-logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="white" fill-opacity="0.15" />
            <path
              d="M24 10L36 17V31L24 38L12 31V17L24 10Z"
              stroke="white"
              stroke-width="2"
              fill="none"
            />
            <path
              d="M24 18L30 21.5V28.5L24 32L18 28.5V21.5L24 18Z"
              fill="white"
              fill-opacity="0.8"
            />
          </svg>
        </div>
        <h1 class="brand-title">RBAC</h1>
        <p class="brand-subtitle">权限管理系统</p>
        <p class="brand-desc">统一身份认证 · 细粒度权限控制 · 安全可靠</p>
      </div>

      <!-- 右侧表单区 -->
      <div class="card-form">
        <div class="form-header">
          <h2 class="form-title">欢迎回来</h2>
          <p class="form-hint">请登录您的账号</p>
        </div>

        <el-form
          :model="form"
          ref="ruleFormRef"
          :rules="loginRules"
          status-icon
          class="login-form"
          label-position="top"
        >
          <el-form-item prop="username" label="用户名">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="UserIcon"
              @keyup.enter="onSubmitLogin"
            />
          </el-form-item>

          <el-form-item prop="password" label="密码">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              size="large"
              type="password"
              show-password
              :prefix-icon="LockIcon"
              @keyup.enter="onSubmitLogin"
            />
          </el-form-item>

          <el-form-item prop="captcha" label="验证码">
            <div class="captcha-row">
              <el-input
                v-model="form.captcha"
                placeholder="请输入验证码"
                size="large"
                :prefix-icon="ShieldIcon"
                @keyup.enter="onSubmitLogin"
                class="captcha-input"
              />
              <div class="captcha-img" @click="requestCaptcha" title="点击刷新">
                <el-image :src="captchaState.img_base" fit="fill" />
                <span class="captcha-refresh">↻</span>
              </div>
            </div>
          </el-form-item>

          <el-form-item class="submit-item">
            <el-button
              type="primary"
              size="large"
              :loading="loginLoading"
              class="submit-btn"
              @click="onSubmitLogin"
            >
              {{ loginLoading ? '登录中...' : '登 录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
// ── 变量 ──────────────────────────────────────────────
@primary: #4f46e5;
@primary-light: #6366f1;
@primary-dark: #3730a3;
@card-radius: 20px;
@transition: all 0.25s ease;

// ── 页面容器 ──────────────────────────────────────────
.login-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('/background.jpg') center / cover no-repeat;
  overflow: hidden;
}

// ── 背景遮罩 ──────────────────────────────────────────
.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.75) 0%, rgba(17, 24, 39, 0.85) 100%);
  backdrop-filter: blur(2px);
}

// ── 装饰圆形 ──────────────────────────────────────────
.bg-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.12;
    background: white;
  }
  .shape-1 {
    width: 400px;
    height: 400px;
    top: -120px;
    left: -100px;
  }
  .shape-2 {
    width: 300px;
    height: 300px;
    bottom: -80px;
    right: -60px;
  }
  .shape-3 {
    width: 180px;
    height: 180px;
    top: 60%;
    left: 15%;
  }
}

// ── 卡片 ──────────────────────────────────────────────
.login-card {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(860px, 92vw);
  min-height: 480px;
  border-radius: @card-radius;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
}

// ── 左侧品牌 ──────────────────────────────────────────
.card-brand {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  background: linear-gradient(160deg, @primary 0%, @primary-dark 100%);
  color: white;
  text-align: center;

  .brand-logo {
    width: 64px;
    height: 64px;
    margin-bottom: 20px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .brand-title {
    font-size: 2.4rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    margin: 0 0 6px;
  }

  .brand-subtitle {
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.9;
    margin: 0 0 24px;
  }

  .brand-desc {
    font-size: 0.78rem;
    opacity: 0.65;
    line-height: 1.8;
    margin: 0;
  }
}

// ── 右侧表单 ──────────────────────────────────────────
.card-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 44px;
  background: #fff;

  .form-header {
    margin-bottom: 32px;

    .form-title {
      font-size: 1.6rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 6px;
    }

    .form-hint {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
  }
}

// ── 表单内部 ──────────────────────────────────────────
.login-form {
  :deep(.el-form-item__label) {
    font-size: 0.82rem;
    font-weight: 600;
    color: #374151;
    padding-bottom: 4px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 10px;
    box-shadow: 0 0 0 1px #e5e7eb;
    transition: @transition;

    &:hover {
      box-shadow: 0 0 0 1px #a5b4fc;
    }

    &.is-focus {
      box-shadow: 0 0 0 2px @primary-light;
    }
  }

  :deep(.el-input__prefix-icon) {
    color: #9ca3af;
  }
}

// ── 验证码行 ──────────────────────────────────────────
.captcha-row {
  display: flex;
  gap: 10px;
  width: 100%;

  .captcha-input {
    flex: 1;
  }

  .captcha-img {
    position: relative;
    flex: 0 0 110px;
    height: 40px;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid #e5e7eb;
    transition: @transition;

    &:hover {
      border-color: @primary-light;

      .captcha-refresh {
        opacity: 1;
      }
    }

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }

    .captcha-refresh {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(79, 70, 229, 0.55);
      color: white;
      font-size: 1.2rem;
      opacity: 0;
      transition: @transition;
    }
  }
}

// ── 提交按钮 ──────────────────────────────────────────
.submit-item {
  margin-top: 8px;
  margin-bottom: 0;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  border-radius: 10px;
  background: linear-gradient(90deg, @primary 0%, @primary-light 100%);
  border: none;
  transition: @transition;

  &:hover {
    background: linear-gradient(90deg, @primary-dark 0%, @primary 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

// ── 响应式：平板以下折叠左侧 ─────────────────────────
@media (max-width: 640px) {
  .login-card {
    flex-direction: column;
    width: 92vw;
    min-height: unset;
  }

  .card-brand {
    flex: none;
    padding: 32px 24px 24px;

    .brand-logo {
      width: 48px;
      height: 48px;
    }

    .brand-title {
      font-size: 1.8rem;
    }

    .brand-desc {
      display: none;
    }
  }

  .card-form {
    padding: 28px 24px 36px;

    .form-header {
      margin-bottom: 20px;
    }
  }
}
</style>
