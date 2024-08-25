import { http } from '@/utils/request'
import service from '@/utils/request'
import type { Result } from '@/utils/request'

export function getDeptList() {
  return http.get<Result<MenuItem[]>>('/api/system/dept/list')
}

export function getDeptDetail(id: number) {
  return http.get<Result>('/api/system/dept/detail' + '?id=' + id)
}

export function createDept(body: DeptItem) {
  return http.post<Result>('/api/system/dept/create', body)
}

export function updateDept(body: DeptItem) {
  return http.post<Result>('/api/system/dept/update', body)
}

export function deleteDept(parameter: { id: number }): Promise<Result> {
  return service({
    url: '/api/system/dept/delete',
    method: 'post',
    params: parameter
  })
}

export function batchEnableDept(body: { ids: number[] }) {
  return http.post<Result>('/api/system/dept/batch/enable', body)
}

export function batchDisableDept(body: { ids: number[] }) {
  return http.post<Result>('/api/system/dept/batch/disable', body)
}
