<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-button type="primary" icon="el-icon-upload2" @click="upload">上传</el-button>
    <el-button type="primary" icon="el-icon-upload2" @click="upload_exit">出场</el-button>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
// import axios from 'axios'
export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      Carlicense: [],
      Date: []
    }
  },

  methods: {

    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      {
        []
      }
      console.log('清空')
      console.log(this.Carlicense)
      console.log(this.Date)
      results.forEach(item => {
        this.Carlicense.push(item.Carlicense)
        this.Date.push(item.Date)
      })
    },
    // upload(){
    //   var _this = this;
    //   console.log(_this.Carlicense,_this.Date)
    //   if(_this.Carlicense.length==0||_this.Date.length==0){
    //     _this.$message.warning("请上传进出记录文件")
    //     console.log("==0")
    //   }else{
    //     console.log("!=0")
    //     this.$axios.get("http://localhost:8080/recognition/uploadEntranLpr",{
    //       license:_this.Carlicense,
    //       date:_this.Date,
    //
    //     })
    //     //   .then(function (resp) {
    //     //   console.log(resp)
    //     //   _this.tableData = resp.data;
    //     //   _this.total = resp.data.length;
    //     // })
    //   }
    // }
    upload: function() {
      console.log(this.Carlicense)
      console.log(this.Date)
      // axios
      //   .get("http://localhost:8080/recognition/uploadEntranLpr/"+this.Carlicense+"/"+this.Date
      //   )
    },
    upload_exit: function() {
      console.log(this.Carlicense)
      console.log(this.Date)
      // axios
      //   .get("http://localhost:8080/recognition/uploadExitLpr/"+this.Carlicense+"/"+this.Date
      //   )
    }
    /** *
     * post方法传参400错误
     */
    // upload:function () {
    //   var _this=this;
    //
    //   console.log(_this.Carlicense);
    //   axios
    //     .post("http://localhost:8080/recognition/test",{license:_this.Carlicense})
    // }
  }
}
</script>
