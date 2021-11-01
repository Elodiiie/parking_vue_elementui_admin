<template>
  <div style="padding-left: 100px;padding-top: 50px;overflow:auto;">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      style="width:40%"
    >
      <el-form-item label="用户">
        <el-input v-model="ruleForm.userid" disabled />
      </el-form-item>
      <el-form-item label="车牌" prop="carlicense">
        <el-input v-model="ruleForm.carlicense" />
      </el-form-item>
      <el-form-item label="包月" prop="vip">
        <el-switch
          v-model="ruleForm.vip"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
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
        userid: '',
        carlicense: '',
        vip: 0
      },
      u_userid: '',
      rules: {
        carlicense: [
          { required: true, message: '请输入车牌', trigger: 'blur' },
          { min: 1, max: 7, trigger: 'blur' }
        ],
        vip: [
          { required: true, message: '请输入是否包月', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const _this = this
    this.$axios.get('http://localhost:8080/car/findById/' + this.$route.query.id).then(function(resp) {
      // console.log(resp)
      _this.ruleForm = resp.data
    })
  },
  methods: {
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.put('http://localhost:8080/car/updatecar', this.ruleForm).then(function(resp) {
            console.log(resp)
            if (resp.data) {
              _this.$alert('修改成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push('/managecar/carmanage')
                }
              })
            } else {
              this.$message('更新失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.u_userid = this.ruleForm.userid
      this.$refs[formName].resetFields()
      this.ruleForm.userid = this.u_userid
    }
  }
}
</script>
