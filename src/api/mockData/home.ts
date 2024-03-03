const getHomeData = [
  {
    url: '/home/getTableData',
    type: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          tableData: [
            {
              name: 'Product A',
              daily_buy: 10,
              monthly_buy: 300,
              total_buy: 5000
            },
            {
              name: 'Product B',
              daily_buy: 5,
              monthly_buy: 150,
              total_buy: 2000
            },
            {
              name: 'Product C',
              daily_buy: 20,
              monthly_buy: 600,
              total_buy: 10000
            }
          ]
        }
      }
    }
  },
  {
    url: '/home/getCountData',
    type: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          CountData: [
            {
              name: '今日支付订单',
              value: 1234,
              icon: 'SuccessFilled',
              color: '#7D3C98'
            },
            {
              name: '今日收藏订单',
              value: 67,
              icon: 'StarFilled',
              color: '#7D3C98'
            },
            {
              name: '今日未支付订单',
              value: 12,
              icon: 'GoodsFilled',
              color: '#7D3C98'
            },
            {
              name: '本月支付订单',
              value: 8886,
              icon: 'SuccessFilled',
              color: '#3498DB'
            },
            {
              name: '本月收藏订单',
              value: 677,
              icon: 'StarFilled',
              color: '#3498DB'
            },
            {
              name: '本月未支付订单',
              value: 78,
              icon: 'GoodsFilled',
              color: '#3498DB'
            }
          ]
        }
      }
    }
  }
]

// const getCountData = [

// ]
export default getHomeData
