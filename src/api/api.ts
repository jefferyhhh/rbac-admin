import get from './request'
import post from './request'

export default {
  getTableData(params: any) {
    return get({
      url: '/home/getTableData',
      method: 'get',
      data: params,
      params
    })
  },
  getCountData(params: any) {
    return get({
      url: '/home/getCountData',
      method: 'get',
      data: params,
      params
    })
  },
  getCaptcha() {
    return post({
      url: '/api/system/auth/captcha/get'
    })
  }
}
