<template>
  <div class="contain">
    <el-radio-group v-model="radio" style="margin-bottom: 20px" @change="change(0)">
      <el-radio :label="0">ALL</el-radio>
      <el-radio :label="1">未处理</el-radio>
      <el-radio :label="2">已处理</el-radio>
    </el-radio-group>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="feedbackid" width="100" prop="feedbackid" />
      <el-table-column label="userid" width="100" prop="userid" />
      <el-table-column label="content" width="700" prop="content" :show-overflow-tooltip="true" />

      <el-table-column label="processing" width="200">
        <template slot-scope="scope">
          <div class="icon1" @click="dialogVisible = true;currentpro(scope.row)">
            <div v-if="scope.row.isRead === 0">
              <svg-icon icon-class="daichuli" class="icon2" />
              未处理
            </div>
            <div v-else-if="scope.row.isRead === 2">
              <svg-icon icon-class="yichuli" class="icon2" />
              已处理
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>您确定要修改为{{ nextmessage }}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false;updataIsRead()">确 定</el-button>
      </span>
    </el-dialog>
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
    name: 'Feedback',
    data() {
      return {
        pageSize: 6,
        total: 10,
        tablenum: 0,
        tableData: [],
        radio: 0,
        params: '',
        updata_params: '',
        dialogVisible: false,
        currentprocess: 0,
        currentfeedbackid: 0,
        nextmessage: ''
      }
    },
    created() {
      var _this = this;
      this.$axios.get('http://localhost:8080/feedback/findAll/0/8').then(function(resp) {
        _this.tableData = resp.data.content;
        _this.total = resp.data.totalElements
      })
    },
    methods: {
      currentpro(row) {
        this.currentprocess = row.isRead;
        this.currentfeedbackid = row.feedbackid;
        row.isRead === 0 ? this.nextmessage = '已处理' : this.nextmessage = '未处理'
      },
      updataIsRead() {
        if (this.currentprocess === 0) {
          this.updata_params = 'processed/';
        } else {
          this.updata_params = 'processing/';
        }
        this.$axios.get('http://localhost:8080/feedback/' + this.updata_params + this.currentfeedbackid).then(function(resp) {

        })
        location.reload()
      },
      tableRowClassName({ row }) {
        if (row.isRead === 0) {
          return 'processing';
        } else if (row.isRead === 2) {
          return 'processed';
        }
        return '';
      },
      change(currentPage) {
        var _this = this;
        if (this.radio === 0) {
          this.params = 'All/';
        } else if (this.radio === 1) {
          this.params = 'NotOperate/';
        } else {
          this.params = 'Operate/';
        }
        this.$axios.get('http://localhost:8080/feedback/find' + this.params + (currentPage - 1) + '/8').then(function(resp) {
          console.log(resp)
          _this.tableData = resp.data.content
          _this.total = resp.data.totalElements
        })
      }
    }
  }
</script>

<style>
  .contain {
    margin: 3%;
  }

  .el-table .processing {
    /*color: #126ba8;*/
    color: #36a3f7;
  }

  .el-table .processed {
    /*color: #45aba2;*/
  }
  .icon1 {
    font-size: 8px;
  }

  .icon1 .icon2 {
    font-size: 42px;
    width: 38px;
  }
</style>
