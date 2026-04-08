// mocks
export interface MockParams {
  url: string
  type: string
  data?: any
  params?: any
  response(option?: any): Record<string, unknown>
}
//home
export interface CountData {
  name: string
  value: number
  icon: string
  color: string
}
