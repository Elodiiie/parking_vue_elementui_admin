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
      <el-form-item label="用户" prop="userid">
        <el-input
          v-model="ruleForm.userid"
          oninput="value=value.replace(/[^0-9.]/g,'')"
        />
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
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
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
      rules: {
        userid: [
          { required: true, message: '请输入所属人号', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        carlicense: [
          { required: true, message: '请输入车牌', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        vip: [
          { required: true, message: '请输入是否包月', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8080/car/saveAll', this.ruleForm).then(function(resp) {
            console.log(resp)
            if (resp.data) {
              _this.$alert('添加成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push('/managecar/carmanage')
                }
              })
            } else {
              this.$message('添加失败')
            }
          })
        } else {
          console.log('error submit!!')
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
