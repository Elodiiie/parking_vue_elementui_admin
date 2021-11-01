<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <div>
      <FilenameOption v-model="filename" />
      <BookTypeOption v-model="bookType" />
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
        {{ $t('excel.export') }}
      </el-button>
    </div>
    <el-table :data="tableData" style="padding: 20px">
      <el-table-column prop="userid" label="ID" width="140" />
      <el-table-column prop="username" label="车主" width="140" />
      <el-table-column prop="phone" label="手机" width="140" />
      <el-table-column prop="sex" label="性别" width="140">
        <template slot-scope="scope">
          {{ scope.row.sex === null ? ' ' : ( scope.row.sex===0? '男' : '女' ) }}
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="角色" width="140" />
      <el-table-column prop="email" label="邮箱" width="140" />
      <el-table-column prop="balance" label="账户" width="140" />
      <el-table-column prop="introduction" label="个人信息" width="140" />
    </el-table>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
// options components
import FilenameOption from './components/FilenameOption'

import BookTypeOption from './components/BookTypeOption'
export default {
  name: 'ExportExcel',
  components: { FilenameOption, BookTypeOption },
  data() {
    return {
      tableData: [],
      listLoading: true,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  created() {
    var _this = this
    this.$axios.get('http://localhost:8080/user/find').then(function(resp) {
      console.log(resp)
      _this.tableData = resp.data
    })
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['userid', 'username', 'sex', 'phone', 'email', 'roles', 'balance', 'introduction']
        const filterVal = ['userid', 'username', 'sex', 'phone', 'email', 'roles', 'balance', 'introduction']
        const tableData = this.tableData
        const data = this.formatJson(filterVal, tableData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: true,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
