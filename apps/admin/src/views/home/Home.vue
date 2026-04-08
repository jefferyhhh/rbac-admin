<script lang="ts" setup>
import { type ComponentInternalInstance, getCurrentInstance, onMounted, ref } from 'vue'
import { type CountData } from '@/api/types'
import LineChart from './components/LineChart.vue'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const tableData = ref([])
const countData = ref<CountData[]>()
const getTableList = async () => {
  // await axios.get('/home/getData').then((response) => {
  //   console.log(response)
  //   if (response.data.code == 200) {
  //     tableData.value = response.data.data.tableData
  //   }
  // })
  let res = await proxy?.$api.getTableData('')
  tableData.value = res.data.data.tableData
}
const getCountData = async () => {
  let res = await proxy?.$api.getCountData('')

  countData.value = res.data.data.CountData
}
onMounted(() => {
  getTableList(), getCountData()
})

const tableLabels = {
  name: 'Product Name',
  daily_buy: 'Daily Sales',
  monthly_buy: 'Monthly Sales',
  total_buy: 'Total Sales'
}
</script>

<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/avatar.png" alt="" />
          <div class="userInfo">
            <p>admin</p>
            <p>超级管理员</p>
          </div>
        </div>
        <div class="loginInfo">
          <p>上次登录时间<span>2023-12-12</span></p>
        </div>
      </el-card>
      <el-card shadow="hover" style="margin-top: 20px; height: 350px">
        <el-table :data="tableData">
          <el-table-column v-for="(val, key) in tableLabels" :label="val" :key="key" :prop="key" />
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card
          shadow="hover"
          :body-style="{ display: 'flex', padding: '0px' }"
          v-for="(item, key) in countData"
          :key="key"
        >
          <component class="icons" :is="item.icon" :style="{ color: item.color }" />
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card style="height: 280px">
        <div ref="echarts">
          <LineChart />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    img {
      border-radius: 50%;
      width: 150px;
      height: 150px;
      margin-right: 40px;
    }
  }
  .loginInfo {
    p {
      line-height: 28px;
      font-size: 14px;
      color: #999;
      span {
        color: #666;
        margin-left: 70px;
      }
    }
  }
}
.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-card {
    width: 32%;
    margin-bottom: 20px;
  }
  .icons {
    width: 80px;
    height: 80px;
  }
  .detail {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .num {
      font-size: 30px;
      margin-bottom: 10px;
    }
    .txt {
      font-size: 14px;
      text-align: center;
      color: #999;
    }
  }
}
</style>
