<template>
  <div style="padding-left: 100px;padding-top: 50px;overflow:auto;display: flex;">

    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      style="width:80%;"
    >
      <el-row type="flex" style="padding-bottom: 10px;display: flex">
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
        <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <!--<el-image-->
      <!--style="width: 130px; height: 100px;padding-right: 50px;display: flex;"-->
      <!--:src="ruleForm.avatar"-->
      <!--:fit="fill"></el-image>-->
      <!--头像-->
      <div class="components-container">
        <pan-thumb :image="ruleForm.avatar">
          <h4>{{ ruleForm.username }}</h4>
          <h6>{{ ruleForm.introduction }}</h6>
        </pan-thumb>
        <!--<el-button type="primary" icon="upload"  @click="imagecropperShow=true">Change Avatar-->
        <!--</el-button>-->
        <!--<image-cropper-->
        <!--v-show="imagecropperShow"-->
        <!--:width="200"-->
        <!--:height="200"-->
        <!--:key="imagecropperKey"-->
        <!--url="/upload/avatar"-->
        <!--lang-type="en"-->
        <!--@close="close"-->
        <!--@crop-upload-success="cropSuccess"/>-->
      </div>
    </div>
  </div>

</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  name: 'UpdateUser',
  components: { ImageCropper, PanThumb },
  data() {
    return {
      icon: 'el-input__icon el-icon-view',
      imagecropperShow: false,
      imagecropperKey: 0,
      image: 'https://tse1-mm.cn.bing.net/th/id/R-C.95c5ca2f2acdeadbc19ffea5d4e08a85?rik=TAkR6hvyHGAAjA&riu=http%3a%2f%2fpic27.nipic.com%2f20130324%2f4798024_113110562000_2.jpg&ehk=2HO5iNE40qB8dNAQiZzAOlHcIiYq0ATS3qgB%2bi5IB0g%3d&risl=&pid=ImgRaw&r=0',
      ruleForm: {
        username: '',
        password: '',
        phone: '',
        email: '',
        sex: '',
        roles: false,
        introduction: '',
        avatar: ''
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
  created() {
    const _this = this
    console.log(this.$route.query.id)
    this.$axios.get('http://localhost:8080/user/findById/' + this.$route.query.id).then(function(resp) {
      console.log(resp)
      _this.ruleForm = resp.data
    })
  },
  methods: {
    // 头像上传组件的方法
    cropSuccess(resData) {
      console.log(resData)
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.ruleForm.avatar = resData.files.avatar
    },
    // 头像上传组件的方法
    close() {
      this.imagecropperShow = false
    },
    // 密码失焦事件
    onBlur() {
      this.passw = 'password'
      this.icon = 'el-input__icon el-icon-view'
    },
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.put('http://localhost:8080/user/updateuser', this.ruleForm).then(function(resp) {
            console.log(resp)
            if (resp.data) {
              _this.$alert('修改成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push('/manageacc/accmanage')
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
<style scoped>
  .avatar{
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
</style>
