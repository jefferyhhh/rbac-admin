import { http } from '@/utils/request'
import service from '@/utils/request'
import type { Result } from '@/utils/request'

interface getRolelistParams {
  page?: number
  page_size?: number
  name?: string
  available?: boolean
}
export interface submitRoleBody {
  id?: number
  name: string
  description?: string
  order: number
  available?: boolean
}
export interface roleListType {
  id?: number
  index?: number
  name?: string
  order?: number
  data_scope?: number
  available?: boolean
  description?: string
  created_at?: string
  updated_at?: string
}
export interface permissionDataType {
  role_ids?: number[]
  menu_ids?: number[]
  data_scope?: number
  dept_ids?: number[]
}

export function getRoleList(parameter: getRolelistParams): Promise<Result<roleListType[]>> {
  return service({
    url: '/api/system/role/list',
    method: 'get',
    params: parameter
  })
}

export function getRoleOptions(parameter: number) {
  return http.get<Result>('/api/system/role/detail' + '?id=' + parameter)
}

export function createRole(body: submitRoleBody) {
  return http.post<Result>('/api/system/role/create', body)
}

export function updateRole(body: submitRoleBody) {
  return http.post<Result>('/api/system/role/update', body)
}

export function deleteRole(parameter: { id: number }): Promise<Result> {
  return service({
    url: '/api/system/role/delete',
    method: 'post',
    params: parameter
  })
}

export function getRolePermission(parameter: number) {
  return http.get<Result>('/api/system/role/permission' + '?id=' + parameter)
}

export function setPermission(body: permissionDataType) {
  return http.post<Result>('/api/system/role/permission/setting', body)
}

export function batchEnableRole(body: { ids: number[] }): Promise<Result> {
  return service({
    url: '/api/system/role/batch/enable',
    method: 'post',
    data: body
  })
}

export function batchDisableRole(body: { ids: number[] }): Promise<Result> {
  return service({
    url: '/api/system/role/batch/disable',
    method: 'post',
    data: body
  })
}
