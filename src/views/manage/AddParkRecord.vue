<template>
  <div style="padding: 50px;overflow:auto;">

    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      style="width:40%"
    >

      <el-form-item label="车牌号" prop="carid">
        <el-input v-model="ruleForm.carid" />
      </el-form-item>

      <el-form-item label="进出时间" required>
        <el-date-picker
          v-model="ruleForm.value1"
          format="yyyy-MM-dd HH:mm:ss"

          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          @input="daterangeChange"
        />
      </el-form-item>
      <el-form-item label="扣费" prop="fare">
        <el-input v-model="ruleForm.fare" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddParkRecord',
  data() {
    return {
      ruleForm: {
        carid: '',
        fare: '',
        entrancetime: '',
        exittime: '',
        value1: []
      },
      rules: {
        carid: [
          { required: true, message: '请输入车牌号', trigger: 'blur' }
        ],
        charge: [
          { required: true, message: '请选择扣费金额', trigger: 'change' }
        ]
      }
    }
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
    submitForm(formName) {
      this.ruleForm.entrancetime = this.ruleForm.value1[0]
      console.log(this.ruleForm.entrancetime)
      this.ruleForm.exittime = this.ruleForm.value1[1]
      var _this = this
      console.log(this.ruleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8080/parkrecord/addRecord', this.ruleForm).then(function(resp) {
            console.log(resp)
            if (resp.data) {
              _this.$alert('添加成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push('/manage/parkrecordmanage')
                }
              })
            } else {
              this.$message('更新失败')
            }
          })
        } else {
          alert('error submit!!')
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
