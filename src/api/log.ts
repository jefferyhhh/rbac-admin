import service from '@/utils/request'

interface getLogParameter {
  page?: number
  page_size?: number
  request_path?: string
  creator?: string
  start_time?: string
  end_time?: string
}
export function getLogList(parameter: getLogParameter) {
  return service({
    url: '/api/system/log/list',
    method: 'get',
    params: parameter
  })
}

export interface creatorTableDataType {
  id?: number
  name?: string
  available?: string
  description?: string
}

export interface logDataType {
  id?: number
  index?: number
  request_path?: string
  request_method?: string
  request_ip?: string
  request_browser?: string
  request_os?: string
  response_code?: number
  request_payload: string
  response_json?: string
  creator?: creatorTableDataType
  created_at?: string
  updated_at?: string
}
