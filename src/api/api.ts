import get from './request'
export default {
  getTableData(params: any) {
    return get({
      url: '/home/getData',
      method: 'get',
      data: params,
      params
    })
  }
}
