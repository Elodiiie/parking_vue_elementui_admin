<template>
  <div style="padding-left: 100px;padding-top: 50px;overflow:auto;">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      style="width:60%;"
    >
      <el-row type="flex" style="padding-bottom: 10px">
        <el-col>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model.trim="ruleForm.password"
              placeholder="请输入密码"
              type="password"
              clearable
              show-password
              @blur="onBlur"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" style="padding-bottom: 10px">
        <el-col>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="ruleForm.phone"
              oninput="value=value.replace(/[^0-9.]/g,'')"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="ruleForm.email"

              @blur="sendEmail"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" style="padding-bottom: 10px">
        <el-col>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="角色">
            <el-switch
              v-model="ruleForm.roles"
              active-value="admin"
              inactive-value="common"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="个人简介" style="padding-bottom: 10px">
        <el-input
          v-model="ruleForm.introduction"
          type="textarea"
          maxlength="50"
          show-word-limit
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
  name: 'AddUser',
  data() {
    return {
      icon: 'el-input__icon el-icon-view',
      ruleForm: {
        username: '',
        password: '',
        phone: '',
        email: '',
        sex: '',
        roles: false,
        introduction: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入邮箱', trigger: 'blur' }
        ],
        sex: [
          { required: false, message: '请输入性别', trigger: 'blur' }
          // { min: 1, max: 3, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    // 密码失焦事件
    onBlur() {
      this.passw = 'password'
      this.icon = 'el-input__icon el-icon-view'
    },
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8080/user/save', this.ruleForm).then(function(resp) {
            console.log(resp)
            if (resp.data) {
              _this.$alert('添加成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push('/manageacc/accmanage')
                }
              })
            } else {
              this.$message('添加失败')
            }
          })
        } else {
          // console.log('error submit!!');
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    sendEmail: function() {
      var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (this.ruleForm.email !== '' && !regEmail.test(this.ruleForm.email)) {
        this.$message({
          message: '邮箱格式不正确',
          type: 'error'
        })
        this.ruleForm.email = ''
      }
    }
  }
}
</script>
