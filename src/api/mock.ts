import Mock from 'mockjs'
import { type MockParams } from './types'
import getTableData from './mockData/home'

//需要遍历的请求
const mocks = [...getTableData]
//设置延时
Mock.setup({
  timeout: '200-2000'
})
export function mockRequest() {
  let i: MockParams
  for (i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', i.response)
  }
}
