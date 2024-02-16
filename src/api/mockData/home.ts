const getHomeData = [
  {
    url: '/home/getData',
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
  }
]
export default getHomeData
