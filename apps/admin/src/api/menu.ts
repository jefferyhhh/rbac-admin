import { http } from '@/utils/request'
import service from '@/utils/request'
import type { Result } from '@/utils/request'

//修改类型，id可忽略
type myMenuItem = Omit<MenuItem, 'id'> & { id?: number }

export function getMenuList() {
  return http.get<Result<MenuItem[]>>('/api/system/menu/list')
}
export function createMenu(body: myMenuItem) {
  return http.post<Result>('/api/system/menu/create', body)
}
export function updateMenu(body: MenuItem) {
  return http.post<Result>('/api/system/menu/update', body)
}
export function deleteMenu(params: { id: number }): Promise<Result> {
  return service({
    url: '/api/system/menu/delete',
    method: 'post',
    params: params
  })
}
export function getMenuOptions() {
  return http.get<Result<MenuItem[]>>('/api/system/menu/options')
}
export function getMenuDetail(id: number) {
  return http.get<Result<MenuItem>>('/api/system/menu/detail' + '?id=' + id)
}
