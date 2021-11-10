<template>
  <div style="padding: 100px;overflow:auto;">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      style="width:40%"
    >
      <el-form-item label="记录号" prop="parkrecordid">
        <el-input v-model="ruleForm.parkrecordid" disabled />
      </el-form-item>
      <el-form-item label="车牌号" prop="carid">
        <el-input v-model="ruleForm.carid" disabled />
      </el-form-item>

      <el-form-item label="进出" required>
        <el-date-picker
          v-model="ruleForm.value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          @input="daterangeChange"
        />
      </el-form-item>
      <el-form-item label="扣费" prop="fare">
        <el-input v-model="ruleForm.fare" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        parkrecordid: '',
        carid: '',
        fare: '',
        entrancetime: '',
        exittime: '',
        value1: []
      },

      time: [],
      rules: {
        carid: [
          { required: true, message: '请输入车牌号', trigger: 'blur' }

        ],
        fare: [
          { required: true, message: '请选择扣费金额', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const _this = this
    this.time = []
    this.$axios.get('http://localhost:8080/parkrecord/findById/' + this.$route.query.id).then(function(resp) {
      console.log(resp)
      _this.time.push(resp.data.entrancetime)
      _this.time.push(resp.data.exittime)
      _this.ruleForm = resp.data
      _this.ruleForm.value1 = _this.time
    })
  },
  methods: {
    daterangeChange(e) {
      const _this = this
      console.log(e)
      _this.$nextTick(() => {
        _this.$set(_this.ruleForm, 'value1', [e[0], e[1]])
        _this.$forceUpdate()
      })
    },
    submitForm: function(formName) {
      this.ruleForm.entrancetime = this.ruleForm.value1[0]
      this.ruleForm.exittime = this.ruleForm.value1[1]
      console.log(this.ruleForm)
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.put('http://localhost:8080/parkrecord/updateParkRecord', this.ruleForm).then(function(resp) {
            console.log(resp)
            if (resp.data.code === 20000) {
              _this.$axios.post('http://localhost:8080/parkrecord/sendMess', _this.ruleForm);
              _this.$alert('修改成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push({
                    path: '/manage/parkrecordmanage'
                  })
                }
              })
            } else {
              _this.$message.error('更新失败--' + resp.data.message)
            }
          })
        } else {
          alert('error submit!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.ruleForm.fare = ''
      this.ruleForm.value1 = ''
    }

  }
}
</script>
<style scoped>

</style>

