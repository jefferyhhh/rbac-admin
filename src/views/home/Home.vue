<script lang="ts" setup>
import { type ComponentInternalInstance, getCurrentInstance, onMounted, ref } from 'vue'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const tableData = ref([])
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
onMounted(() => {
  getTableList()
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
    <el-col :span="16" style="margin-top: 20px" />
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
</style>
