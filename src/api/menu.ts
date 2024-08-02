import { http } from '@/utils/request'
// import service from '@/utils/request'
import type { Result } from '@/utils/request'

export function getMenuList() {
  return http.get<Result<MenuItem[]>>('/api/system/menu/list')
}
