<template>
  <div id="wrapper" align="center">

    <!--<div align="center">-->
    <!--<h1> Welcome to EfonMark!</h1>-->
    <!--</div>-->

    <!--<div align="center">-->
    <!--<el-input id="input01"-->
    <!--type="textarea"-->
    <!--:autosize="{ minRows: 2, maxRows: 10}"-->
    <!--placeholder="请选择文件"-->
    <!--v-model="textarea">-->
    <!--</el-input>-->
    <!--</div>-->

    <!--<div align="center">-->
    <!--<el-button type="primary" v-on:click="openFile()" round>选择文件</el-button>-->
    <!--<el-button type="primary" v-on:click="showRealPath()" round>显示路径</el-button>-->
    <!--<input type="file" name="filename" id="open" style="display:none" />-->
    <!--</div>-->
    <h2> 视频</h2>
    备注：HyperLpr车牌识别<br>
    <input type="file" @change="getdev ">
    <el-button type="primary" round :loading="loading" @click="lpr">视频识别</el-button>
  </div>
</template>

<script>
export default {
  name: 'Hyperlpr',
  data() {
    return {
      textarea: '',
      loading: false
    }
  },
  methods: {
    getFile(e) {
      console.log(e.target.files)
    },
    openFile: function() {
      document.getElementById('open').click()
    },
    showRealPath: function() {
      document.getElementById('input01').value = document.getElementById('open').files[0].path
      console.log(document.getElementById('open').files[0].path)
    },
    getdev() {
      //  更新数据devInfo.txt文件接口
      const xhr = new XMLHttpRequest();
      const okStatus = document.location.protocol === 'file:' ? 0 : 200;
      console.log(okStatus);
      xhr.open('GET', '../../demofile.txt', false);// 文件路径
      xhr.overrideMimeType('text/html;charset=utf-8');// 默认为utf-8
      xhr.send(null)
    },
    lpr() {
      this.loading = true;
      var _this = this;
      this.$axios.post('http://localhost:8080/recognition/lpr')
        .then(function(resp) {
          console.log(resp);
          _this.loading = false
        });
      this.loading = false
    }

  }

}

</script>

<style scoped>

</style>
