<template>
  <div style="padding: 30px;overflow:auto;">
    <el-autocomplete
      v-model="searchContent"
      class="inline-input"
      :fetch-suggestions="querySearch"
      placeholder="请输入手机号"
      :trigger-on-focus="false"
      prefix-icon="el-icon-search"
      style="width: 20%"
      @select="handleSelect"
    />
    <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="add">增加</el-button>
    <el-button type="primary" icon="el-icon-document" @click="userhandleDownload">
      {{ $t('excel.export') }}
    </el-button>
    <el-button circle type="success" size="small" icon="el-icon-refresh" @click="returnHome" />
    <br>
    <el-table :data="tableData" style="padding: 20px">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" size="mini">
            <el-row>
              <el-col span="5">
                <el-form-item label="车主">
                  <span>{{ props.row.username }}</span>
                </el-form-item>
              </el-col>
              <el-col span="5">
                <el-form-item label="邮箱">
                  <span>{{ props.row.email }}</span>
                </el-form-item>
              </el-col>
              <el-col span="5">
                <el-form-item label="权限">
                  <el-tag size="small">{{ props.row.roles=== null ? '未选择' : props.row.roles }}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="5">
                <el-form-item label="账户">
                  <span>￥{{ props.row.balance }}</span>
                </el-form-item>
              </el-col>
              <el-col span="5">
                <el-form-item label="备注">
                  <span>{{ props.row.introduction }}</span>
                </el-form-item>
              </el-col>
              <el-col span="5">
                <el-form-item label="最后登录时间">
                  <span>{{ props.row.lastLoginTime }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="userid" label="ID" width="140" />
      <el-table-column prop="username" label="车主" width="140" />
      <el-table-column prop="phone" label="手机" width="120" />
      <el-table-column prop="sex" label="性别" width="140">
        <template slot-scope="scope">
          {{ scope.row.sex === null ? ' ' : ( scope.row.sex===0? '男' : '女' ) }}
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
    <el-dialog title="个人详细信息" :visible.sync="dialogTableVisible" :before-close="clearDetailData">
      <el-descriptions class="margin-top" title="用户信息" :column="2" border>
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
            <i class="el-icon-mobile-phone" />
            手机号
          </template>
          {{ detailData.phone ===null ? '未填' : detailData.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <svg class="icon" aria-hidden="true" style="font-size: 15px;">
              <use xlink:href="#icon-email" />
            </svg>
            邮箱
          </template>
          {{ detailData.email ===null ? '未填' : detailData.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <svg class="icon" aria-hidden="true" style="font-size: 20px;">
              <use xlink:href="#icon-gender" />
            </svg>
            性别
          </template>
          {{ detailData.sex === null ? '未选择' : ( detailData.sex===0? '男' : '女' ) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-role" />
            </svg>
            角色
          </template>
          <el-tag size="small">{{ detailData.roles=== null ? '未选择' : detailData.roles }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <svg class="icon" aria-hidden="true" style="font-size: 20px;">
              <use xlink:href="#icon-balance" />
            </svg>
            账户余额
          </template>
          {{ detailData.balance }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            备注
          </template>
          {{ detailData.introduction }}
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
  name: 'AccManage',
  data() {
    return {
      searchContent: '',
      pageSize: 6,
      total: 10,
      tableData: [],
      dialogTableVisible: false,
      detailData: []
    }
  },

  created() {
    var _this = this
    this.$axios.get('http://localhost:8080/user/findAll/0/8').then(function(resp) {
      console.log(resp)
      _this.tableData = resp.data.content
      _this.total = resp.data.totalElements
    })
  },
  methods: {
    userhandleDownload() {
      this.$router.push({
        path: '/excel/export-excel'
      })
    },
    async querySearch(queryString, cb) {
      const phonema = []
      await this.$axios.get('http://localhost:8080/user/findByPhoneIsLike/' + queryString).then(function(resp) {
        console.log(resp.data)
        if (resp.data) {
          resp.data.forEach((item) => {
            phonema.push({
              value: item.phone
            })
          })
        }
      })
      cb(phonema)
    },

    handleSelect(item) {
      console.log(item)
    },

    add() {
      this.$router.push({
        path: '/manageacc/adduser'
      })
    },
    returnHome() {
      // const _this = this
      /*  _this.$router.push({
              path: '/'
          })*/
      window.location.reload()
      // _this.$forceUpdate();
    },
    search() {
      var _this = this
      console.log('----------------------------')
      console.log(_this.searchContent)
      if (_this.searchContent.length === 0 || _this.searchContent === '') {
        _this.$message.warning('请输入查询内容')
      } else if (_this.searchContent.length !== 11) {
        _this.$message.warning('请输入11位手机号')
      } else {
        this.$axios.get('http://localhost:8080/user/findByPhone/' + _this.searchContent.trim()).then(function(resp) {
          console.log(resp)
          if (resp.data === '') {
            _this.$message.error('手机号不存在')
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
      this.$axios.get('http://localhost:8080/user/findAll/' + (currentPage - 1) + '/8').then(function(resp) {
        console.log(resp)
        _this.tableData = resp.data.content
        _this.total = resp.data.totalElements
      })
    },
    edit(row) {
      this.dialogTableVisible = false
      console.log(row.userid)
      this.$router.push({
        path: '/manageacc/UpdateUser',
        query: {
          id: row.userid
        }
      })
    },
    showDetail(row) {
      console.log(row.userid)
      const _this = this
      this.$axios.get('http://localhost:8080/user/findById/' + row.userid).then(function(resp) {
        console.log(resp)
        _this.detailData = resp.data
        console.log('--------------------')
        console.log(_this.detailData.roles)
      })
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
        this.$axios.delete('http://localhost:8080/car/deleteuserById/' + row.userid).then(function(resp) {
          _this.$message({
            type: 'success',
            message: '删除成功'
          })
          clearTimeout(_this.timer)
          _this.timer = setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
        this.dialogTableVisible = false
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
  .app-AccountManager {
    margin: 350px;
    padding: 200px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
