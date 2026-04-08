import { http } from '@/utils/request'
import service from '@/utils/request'
import type { Result } from '@/utils/request'

export interface positionItem {
  id: number
  name: string
  description: string | null
  available: boolean
}

export function getPositionOptions() {
  return http.get<Result<positionItem[]>>('/api/system/position/options')
}
