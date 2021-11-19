<template>
  <div style="padding: 30px">
    <el-input
      v-model="searchContent"
      placeholder="可以输入车牌号"
      prefix-icon="el-icon-search"
      style="width: 20%"
    />
    <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

    <el-button type="primary" icon="el-icon-plus" @click="add">增加车辆</el-button>
    <el-button circle type="success" size="small" icon="el-icon-refresh" @click="returnHome" />
    <br>
    <el-table :data="tableData" style="padding: 20px" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column prop="carid" label="ID" width="140" />
      <el-table-column prop="username" label="车主" width="140" />
      <el-table-column prop="carlicense" label="车牌" width="120" />
      <el-table-column prop="vip" label="包月" width="140">
        <template slot-scope="scope">
          {{ scope.row.vip === 0 ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="dialogTableVisible=true;showDetail(scope.row)">详细信息</el-button>
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" @click="deleteById(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="车牌详细信息" :visible.sync="dialogTableVisible" :before-close="clearDetailData">
      <el-dialog
        width="47%"
        title="停车记录详细信息"
        :visible.sync="innerVisible"
        append-to-body
        :before-close="clearInnerDetailData"
      >
        <el-table :data="innerDetailData" max-height="250" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column property="username" label="用户" width="70" />
          <el-table-column property="carlicense" label="车牌" width="100" />
          <el-table-column property="entrancetime" label="入场时间" width="100" />
          <el-table-column property="exittime" label="离场时间" width="100" />
          <el-table-column property="fare" label="金额" width="60" />
        </el-table>
      </el-dialog>
      <el-descriptions class="margin-top" title="车牌信息" :column="1" border>
        <template slot="extra">
          <el-button type="primary" size="small" @click="showInnerDetail(detailData)">查看停车记录</el-button>
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
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-star" />
            </svg>
            包月
          </template>
          {{ detailData.vip ===0 ? '否' : '是' }}
        </el-descriptions-item>
      </el-descriptions>
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
      innerDetailData: [],
      dialogTableVisible: false,
      innerVisible: false
    }
  },
  created() {
    var _this = this
    this.$axios.get('http://localhost:8080/car/findAll1/0/8').then(function(resp) {
      console.log(resp)
      _this.tableData = resp.data.content
      _this.total = resp.data.totalElements
    })
  },
  methods: {
    add() {
      this.$router.push({
        path: '/managecar/addcar'
      })
    },
    returnHome() {
      // const _this = this
      /*  _this.$router.push({
              path: '/'
          })*/
      window.location.reload()
    },
    search() {
      var _this = this
      // alert(_this.searchContent)
      if (_this.searchContent.length === 0 || _this.searchContent === '') {
        _this.$message.warning('请输入查询内容')
      } else {
        this.$axios.get('http://localhost:8080/car/findByCarlicense/' + _this.searchContent.trim()).then(function(resp) {
          console.log(resp)
          if (resp.data === '') {
            _this.$message.error('车牌不存在')
          } else {
            _this.detailData = resp.data
            _this.dialogTableVisible = true
          }
        })
      }
    },
    change(currentPage) {
      // console.log(currentPage)
      var _this = this
      this.$axios.get('http://localhost:8080/car/findAll1/' + (currentPage - 1) + '/8').then(function(resp) {
        console.log(resp)
        _this.tableData = resp.data.content
        _this.total = resp.data.totalElements
      })
    },
    edit(row) {
      this.$router.push({
        path: '/managecar/updatecar',
        query: {
          id: row.carid
        }
      })
    },
    showInnerDetail(data) {
      console.log(data.carid)
      const _this = this
      this.$axios.get('http://localhost:8080/parkrecord/findDetailByCarid/' + data.carid).then(function(resp) {
        console.log('----------innerDetailData-----------')
        console.log(resp.data)
        if (resp.data.length === 0) {
          _this.$message.error('该车辆暂未有停车记录')
        } else {
          _this.innerDetailData = resp.data
          _this.innerVisible = true
        }
      })
    },
    showDetail(row) {
      console.log(row.userid)
      const _this = this
      this.$axios.get('http://localhost:8080/car/findDetailByCarid/' + row.carid).then(function(resp) {
        console.log('---------------------')
        console.log(resp.data.username)
        _this.detailData = resp.data
      })
    },
    clearDetailData() {
      this.detailData = []
      this.dialogTableVisible = false
    },
    clearInnerDetailData() {
      this.innerDetailData = []
      this.innerVisible = false
    },
    deleteById(row) {
      const _this = this
      _this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('http://localhost:8080/car/deletecarById/' + row.carid).then(function(resp) {
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
