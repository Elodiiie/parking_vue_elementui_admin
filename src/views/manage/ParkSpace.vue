<template>
  <div style="padding: 30px">
    <div>
      <div style="display: flex">
        <el-input
          v-model="searchContent"
          placeholder="输入车牌号"
          prefix-icon="el-icon-search"
          style="width: 20%"
        />
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addparkingRecord">添加</el-button>
        <div style="color: #0a76a4;margin-left: 40px;margin-top: 10px">剩余车位数：</div>
        <div class="countto">
          <count-to :start-val="0" :end-val="endVal3" :duration="3200" class="card-panel-num" />/{{ space }}
        </div>
      </div>
      <el-table :data="tableData" border fit highlight-current-row style="width: 55%;margin-top: 15px">
        <el-table-column label="username" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="carlicense" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.carlicense }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Time" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.entrancetime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" round @click="deleteById(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
      @current-change="change"
    />
    <el-dialog title="场内车辆详细信息" :visible.sync="dialogTableVisible" :before-close="clearDetailData">
      <el-descriptions class="margin-top" title="记录信息" :column="2" border>>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user" />
            用户名
          </template>
          {{ detailData.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-phone" />
            手机号
          </template>
          {{ detailData.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-carlicense" />
            </svg>
            车牌号
          </template>
          {{ detailData.carlicense }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time" />
            进场时间
          </template>
          {{ detailData.entrancetime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      endVal3: 0,
      space: 50,
      searchContent: '',
      pageSize: 6,
      total: 10,
      tableData: [],
      detailData: [],
      dialogTableVisible: false
    }
  },
  created() {
    var _this = this
    this.$axios.get('http://localhost:8080/parking/findAll1/0/8').then(function(resp) {
      console.log(resp.data.content)
      _this.tableData = resp.data.content
      _this.total = resp.data.totalElements
    })
    this.$axios.get('http://localhost:8080/parking/getCount').then(function(resp) {
      _this.endVal3 = _this.space - resp.data
    })
  },
  methods: {
    addparkingRecord() {
      this.$router.push({
        path: '/manage/addParking'
      })
    },
    search() {
      var _this = this
      // alert(_this.searchContent)
      if (_this.searchContent.length === 0 || _this.searchContent === '') {
        _this.$message.warning('请输入查询内容')
      } else {
        this.$axios.get('http://localhost:8080/parking/findParkingDetailByCarlicense/' + _this.searchContent.trim()).then(function(resp) {
          console.log(resp.data)
          if (resp.data.code === 20000) {
            _this.detailData = resp.data.data
            _this.dialogTableVisible = true
          } else {
            _this.$message.error('查找失败--' + resp.data.message)
          }
        })
      }
    },
    change(currentPage) {
      // console.log(currentPage)
      var _this = this
      this.$axios.get('http://localhost:8080/parking/findAll1/' + (currentPage - 1) + '/8').then(function(resp) {
        console.log(resp)
        _this.tableData = resp.data.content
        _this.total = resp.data.totalElements
      })
    },
    edit(row) {
    },
    clearDetailData() {
      this.detailData = []
      this.dialogTableVisible = false
    },
    deleteById(row) {
      const _this = this
      _this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('http://localhost:8080/parking/deleteById/' + row.parkingid).then(function(resp) {
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

<style scoped>
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .countto{
    display: flex;
    font-size: 24px;
    color: #36a3f7;
    margin-top: 5px;
  }
</style>
