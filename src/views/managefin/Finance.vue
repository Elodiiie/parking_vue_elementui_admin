<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      active-text-color="#3888fa"
      @select="handleSelect"
    >
      <el-menu-item index="1">收费信息</el-menu-item>
      <el-menu-item index="2" style="width: 80px">缴费信息</el-menu-item>
      <el-submenu index="3">
        <template slot="title">
          |
        </template>
        <el-menu-item index="2-1">新增缴费信息</el-menu-item>
      </el-submenu>
    </el-menu>
    <el-row>
      <el-col style="width: 50%">
        <div>
          <div v-if="tablenum===0">
            <el-table :data="tableData" border fit highlight-current-row style="width: 80%;margin-left:5%;margin-top: 1%">
              <el-table-column label="Username" width="100">
                <template slot-scope="scope">
                  {{ scope.row.username }}
                </template>
              </el-table-column>
              <el-table-column label="Time" width="185">
                <template slot-scope="scope">
                  {{ scope.row.exittime }}
                </template>
              </el-table-column>
              <el-table-column label="Fare" width="80">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.show" v-model="scope.row.fare" placeholder="请输入内容" />
                  <span v-show="!scope.row.show">{{ scope.row.fare >= 0? -scope.row.fare: scope.row.fare }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" round @click="updatefee(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else>
            <el-table :data="tableData" border fit highlight-current-row style="width: 90%;margin-left:5%;margin-top: 1%">
              <el-table-column label="Username" width="100">
                <template slot-scope="scope">
                  {{ scope.row.username }}
                </template>
              </el-table-column>
              <el-table-column label="Time" width="180">
                <template slot-scope="scope">
                  {{ scope.row.time }}
                </template>
              </el-table-column>
              <el-table-column label="Fare" width="80">
                <template slot-scope="scope">
                  {{ scope.row.fare >= 0? +scope.row.fare: scope.row.fare }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" round @click="updatepay(scope.row)">编辑</el-button>
                  <el-button size="small" round @click="deletepay(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col style="width: 50%">
        <div style="display: flex;postion: absolute; right: 0;margin-left: 0px;height: 500px;width: 95%;">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
      @current-change="change"
    />

  </div>
</template>

<script>
import LineChart from './components/LineChart'
export default {
  name: 'Finance',
  components: {
    LineChart
  },
  data() {
    return {
      activeIndex: '1',
      pageSize: 6,
      total: 10,
      tablenum: 0,
      tableData: [],
      payid: 0,
      lineChartData: {
        expectedData: [],
        actualData: []
      }
    }
  },
  created() {
    var _this = this
    this.$axios.get('http://localhost:8080/parkrecord/findAll1/0/8').then(function(resp) {
      console.log(resp.data.content)
      _this.tableData = resp.data.content
      _this.total = resp.data.totalElements
    })
  },
  methods: {
    change(currentPage) {
      // console.log(currentPage)
      var _this = this
      if (this.tablenum === 0) {
        this.$axios.get('http://localhost:8080/parkrecord/findAll1/' + (currentPage - 1) + '/8').then(function(resp) {
          console.log(resp)
          _this.tableData = resp.data.content
          _this.total = resp.data.totalElements
        })
      } else {
        this.$axios.get('http://localhost:8080/pay/findAll/' + (currentPage - 1) + '/8').then(function(resp) {
          console.log(resp)
          _this.tableData = resp.data.content
          _this.total = resp.data.totalElements
        })
      }
    },
    handleSelect(key, keyPath) {
      if (key === '2') {
        console.log(key, keyPath)
        this.tablenum = 1
        this.change(1)
      } else if (key === '1') {
        this.tablenum = 0
        this.change(1)
      } else {
        this.$router.push({
          path: '/managefin/AddPay'
        })
      }
    },
    updatefee(row) {
      console.log(row)

      this.$set(row, 'show', false)
      this.$router.push({
        path: '/manage/updatefare',
        query: {
          id: row.parkrecordid
        }
      })
      // window.location.reload();
      // console.log(row.show);
    },
    deletefee(row) {
      const _this = this
      console.log('deletefee')
      _this.$confirm('此操作会将停车记录表相关信息一并删除！确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('http://localhost:8080/parkrecord/deleteById/' + row.parkrecordid).then(function(resp) {
          _this.$message({
            type: 'success',
            message: '删除成功'
          })
          clearTimeout(_this.timer)
          _this.timer = setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updatepay(row) {
      this.$router.push({
        path: '/managefin/UpdatePay',
        query: {
          id: row.payid,
          username: row.username
        }
      })
    },
    deletepay(row) {
      const _this = this
      _this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('http://localhost:8080/pay/deleteById/' + row.payid).then(function(resp) {
          _this.$message({
            type: 'success',
            message: '删除成功'
          })
          clearTimeout(_this.timer)
          _this.timer = setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
  .radio-label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 30px;
  }
</style>
