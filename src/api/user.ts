import { http } from '@/utils/request'
import service from '@/utils/request'
import type { Result } from '@/utils/request'

import type { loginFormType } from '@/views/login/types'

interface captchaData {
  key: 'string'
  img_base: 'string'
}
interface loginRes {
  access_token: string
  refresh_token: string
  expires_in: number
}
export interface userInfoRes {
  avatar: string
  menus?: MenuItem[]
  username: string
  name: string
  gender: number
  mobile: string | null
  email: string | null
  dept_name: string
  positions: roleOrPosition[]
  roles: roleOrPosition[]
}
interface roleOrPosition {
  id: number
  name: string
  description: string | null
  available: boolean
}
export type updateUserInfoForm = Pick<
  userInfoRes,
  'name' | 'avatar' | 'email' | 'gender' | 'mobile'
>

/**
 * 登录验证
 */

//获取验证码
export function getCaptcha() {
  return http.post<Result<captchaData>>('/api/system/auth/captcha/get')
}
//登录
export function login(body: loginFormType): Promise<Result<loginRes>> {
  return service({
    url: '/api/system/auth/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: body
  })
}
//刷新token
export function getNewToken(body: { refresh_token: string }): Promise<Result<loginRes>> {
  return service({
    url: '/api/system/auth/token/refresh',
    method: 'post',
    data: body
  })
}
/**
 * 用户信息
 */
export function getUserInfo() {
  return http.get<Result<userInfoRes>>('/api/system/user/current/info')
}
export function updateCurrentUserInfo(body: updateUserInfoForm) {
  return http.post<Result>('/api/system/user/current/info/update', body)
}
export function changeCurrentUserPassword(body: { old_password: string; new_password: string }) {
  return http.post<Result>('/api/system/user/current/password/change', body)
}

/**
 * 用户管理
 */
export interface userListType {
  id?: number
  index?: number
  username?: string
  name?: string
  email?: string
  mobile?: string
  gender?: number
  password?: string
  roles?: roleItemType[]
  roleNames?: string
  role_ids?: number[]
  dept_id?: number
  dept_name?: string
  positionNames?: string
  position_ids?: number[]
  positions?: positionItemType[]
  available?: boolean
  is_superuser?: boolean
  creator?: creatorType
  creatorName?: string
  description?: string
  created_at?: string
  updated_at?: string
  last_login?: string
}
export interface roleItemType {
  id?: number
  name?: string
  available?: boolean
  description?: string
}
export interface positionItemType {
  id?: number
  name?: string
  available?: boolean
  description?: string
}
interface creatorType {
  id?: number
  name?: string
}

export function getUserList(params: { page?: number; page_size?: number }) {
  return http.get<Result<userListType[]>>('/api/system/user/list', { params })
}

export function getUserDetail(id: number) {
  return http.get<Result<userListType>>('/api/system/user/detail', { params: { id } })
}

export function createUser(body: userListType) {
  return http.post<Result>('/api/system/user/create', body)
}

export function updateUser(body: userListType) {
  return http.post<Result>('/api/system/user/update', body)
}

export function deleteUser(parameter: { id: number }) {
  return service<Result>({
    url: '/api/system/user/delete',
    method: 'post',
    params: parameter
  })
}
