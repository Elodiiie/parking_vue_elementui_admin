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
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="手机号" required>
        <el-input v-model="phone" />
      </el-form-item>
      <el-form-item label="缴费金额" prop="fare">
        <el-input v-model="ruleForm.fare" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">缴费</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'AddPay',
  data() {
    return {
      ruleForm: {
        username: '',
        fare: '',
        time: ''
      },
      phone: '',
      u_user: [],
      rules: {
        fare: [
          { required: true, message: '请选择扣费金额', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请填写用户名', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm: function(formName) {
      console.log(this.ruleForm)
      var _this = this
      var partten = /^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i
      if (this.phone !== '' && this.ruleForm.username !== '' && partten.test(this.phone)) {
        const _user = {
          'username': this.ruleForm.username,
          'phone': this.phone
        }
        this.$axios.post('http://localhost:8080/user/existByPhoneAndUsername', _user).then(function(resp) {
          if (resp.data) {
            _this.$refs[formName].validate((valid) => {
              if (valid) {
                _this.ruleForm.time = dateFtt('yyyy-MM-dd hh:mm:ss', new Date())
                _this.$axios.post('http://localhost:8080/pay/addRecord', _this.ruleForm).then(function(resp) {
                  console.log(resp.data)
                  if (resp.data.code === 20000) {
                    _this.$alert('缴费成功', '提示', {
                      confirmButtonText: '确定',
                      callback: action => {
                        _this.$router.push({
                          path: '/managefin/Finance'
                        })
                      }
                    })
                  } else {
                    _this.$message.error('缴费失败--' + resp.data.message)
                  }
                })
              } else {
                alert('error submit!')
                return false
              }
            })
          } else {
            _this.$message.error('找不到该用户，请检查用户名和密码')
          }
        })
      } else {
        _this.$message.error('数据为空或手机号格式不正确')
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }

  }
}
function dateFtt(fmt, date) { // author: meizz
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}
</script>

<style scoped>

</style>
