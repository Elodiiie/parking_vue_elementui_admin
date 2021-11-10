<template>
  <div style="padding: 30px">
    <el-input
      v-model="searchContent"
      placeholder="输入车牌号"
      prefix-icon="el-icon-search"
      style="width: 20%"
    />
    <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="addparkRecord">添加</el-button>
    <el-button circle type="success" size="small" icon="el-icon-refresh" @click="returnHome" />
    <br>
    <el-table :data="tableData" style="padding: 20px">
      <el-table-column prop="parkrecordid" label="id" width="140" />
      <el-table-column prop="carlicense" label="车牌" width="120" />
      <el-table-column prop="entrancetime" label="入场时间" width="120" />
      <el-table-column prop="exittime" label="离场时间" width="120" />
      <el-table-column prop="fare" label="金额" width="100" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="dialogDescriVisible=true;showDetail(scope.row)">详细信息</el-button>
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" @click="deleteById(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="单个记录信息" :visible.sync="dialogDescriVisible" :before-close="clearDetailData">
      <el-descriptions class="margin-top" title="记录信息" :column="2" border>
        <template slot="extra">
          <el-button type="primary" size="small" @click="edit(detailData)">修改</el-button>
          <el-button type="primary" size="small" @click="deleteById(detailData)">删除</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user" />
            用户名
          </template>
          {{ detailData.username }}
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
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time" />
            离场时间
          </template>
          {{ detailData.exittime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fare" />
            </svg>
            金额
          </template>
          {{ detailData.fare }}
        </el-descriptions-item>
        <el-descriptions-item />
      </el-descriptions>
    </el-dialog>
    <el-dialog title="停车记录详细信息" :visible.sync="dialogTableVisible" :before-close="clearDetailData">
      <el-descriptions class="margin-top" title="车牌信息" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-carlicense" />
            </svg>
            车牌号
          </template>
          {{ tmpCarlicense }}
        </el-descriptions-item>
      </el-descriptions>
      <el-table :data="detailData" style="padding: 20px">
        <el-table-column prop="username" label="用户名" width="140" />
        <el-table-column prop="entrancetime" label="入场时间" width="120" />
        <el-table-column prop="exittime" label="离场时间" width="120" />
        <el-table-column prop="fare" label="金额" width="100" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row)">修改</el-button>
            <el-button size="mini" @click="deleteById(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <br>
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
export default {
  data() {
    return {
      searchContent: '',
      pageSize: 6,
      total: 10,
      tableData: [],
      detailData: [],
      dialogTableVisible: false,
      dialogDescriVisible: false,
      tmpCarlicense: ''
    }
  },
  created() {
    var _this = this
    this.$axios.get('http://localhost:8080/parkrecord/findAll1/0/8').then(function(resp) {
      // console.log(resp)
      _this.tableData = resp.data.content
      _this.total = resp.data.totalElements
    })
  },
  methods: {
    addparkRecord() {
      this.$router.push({
        path: '/manage/addParkRecord'
      })
    },
    returnHome() {
      // const _this = this
      /*  _this.$router.push({
              path: '/'
          })*/
      window.location.reload()
      // this.$forceUpdate();
    },
    search() {
      var _this = this
      // alert(_this.searchContent)
      if (_this.searchContent.length === 0 || _this.searchContent === '') {
        _this.$message.warning('请输入查询内容')
      } else {
        this.$axios.get('http://localhost:8080/parkrecord/findDetailByCarlicense/' + _this.searchContent.trim()).then(function(resp) {
          console.log(resp);
          if (resp.data === '') {
            _this.$message.error('该车辆暂未有停车记录或车辆不存在')
          } else {
            _this.detailData = resp.data;
            _this.tmpCarlicense = _this.searchContent.trim();
            _this.dialogTableVisible = true
          }
        })
      }
    },
    change(currentPage) {
      // console.log(currentPage)
      var _this = this
      this.$axios.get('http://localhost:8080/parkrecord/findAll1/' + (currentPage - 1) + '/8').then(function(resp) {
        console.log(resp)
        _this.tableData = resp.data.content
        _this.total = resp.data.totalElements
      })
    },
    edit(row) {
      // console.log(row.parkrecordid)
      this.$router.push({
        path: '/manage/UpdateParkRecord',
        query: {
          id: row.parkrecordid
        }
      })
    },
    showDetail(row) {
      console.log(row.userid)
      const _this = this
      this.$axios.get('http://localhost:8080/parkrecord/findDetailByParkrecordid/' + row.parkrecordid).then(function(resp) {
        console.log('---------------------');
        console.log(resp.data)
        _this.detailData = resp.data
      })
    },
    clearDetailData() {
      this.detailData = [];
      this.dialogTableVisible = false;
      this.dialogDescriVisible = false
    },
    deleteById(row) {
      const _this = this;
      _this.$confirm('确认删除吗, 是否继续?', '提示', {
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
</style>
