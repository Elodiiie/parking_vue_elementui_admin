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
      <el-form-item label="用户" prop="username">
        <el-input v-model="ruleForm.username" disabled />
      </el-form-item>
      <el-form-item label="时间" required>
        <div class="block">
          <el-date-picker
            v-model="ruleForm.time"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          />
        </div>
      </el-form-item>
      <el-form-item label="缴费金额" prop="fare">
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
  name: 'UpdatePay',
  data() {
    return {
      ruleForm: {
        payid: '',
        username: '',
        fare: '',
        time: ''
      },
      rules: {
        fare: [
          { required: true, message: '请选择扣费金额', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const _this = this
    this.$axios.get('http://localhost:8080/pay/findById/' + this.$route.query.id).then(function(resp) {
      _this.ruleForm.username = _this.$route.query.username
      _this.ruleForm = resp.data
      _this.ruleForm.time = resp.data.time
      console.log(_this.ruleForm.value1)
    })
  },
  methods: {
    submitForm: function(formName) {
      console.log(this.ruleForm)
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8080/pay/updateRecord', this.ruleForm).then(function(resp) {
            console.log(resp.data)
            if (resp.data.code === 20000) {
              _this.$alert('修改成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push({
                    path: '/managefin/Finance'
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
      this.$refs[formName].resetFields()
    }

  }
}
</script>

<style scoped>

</style>
