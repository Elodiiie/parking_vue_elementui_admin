<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          clearable
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          tabindex="2"
          show-password
          clearable
        />
      </el-form-item>
      <div style="display: flex">
        <el-input v-model="code" name="code" placeholder="点击图片刷新验证码" tabindex="3" clearable class="code-input" />
        <img
          alt="验证码"
          onclick="this.src='http://localhost:8080/defaultKaptcha?d='+new Date()*1"
          src="http://localhost:8080/defaultKaptcha"
        >
      </div>
      <!--<form action="imgvrifyControllerDefaultKaptcha" >-->
      <!--<input type="text" name="tryCode" />-->
      <!--<input type="submit" value="提交" class="btn btn-success"/>-->
      <!--</form>-->

      <el-button
        :loading="loading"
        round
        size="medium"
        type="primary"
        style="width:100%;margin-top: 10px;margin-bottom:30px;color: #0d8e84;background-color: #aae3e0;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>

      <!--<div style="position:relative">-->
      <!--<div class="tips">-->
      <!--<span>{{ $t('login.username') }} : admin</span>-->
      <!--<span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>-->
      <!--</div>-->
      <!--<div class="tips">-->
      <!--<span style="margin-right:18px;">-->
      <!--{{ $t('login.username') }} : editor-->
      <!--</span>-->
      <!--<span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>-->
      <!--</div>-->

      <!--<el-button class="thirdparty-button" type="primary" @click="showDialog=true">-->
      <!--{{ $t('login.thirdparty') }}-->
      <!--</el-button>-->
      <!--</div>-->
    </el-form>

    <!--<el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">-->
    <!--{{ $t('login.thirdpartyTips') }}-->
    <!--<br>-->
    <!--<br>-->
    <!--<br>-->
    <!--<social-sign />-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
// import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: { LangSelect },
  // components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'user1',
        password: 'user111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      code: '',
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)

  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // checkCapslock(e) {
    //   const { key } = e
    //   this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    // },

    handleLogin() {
      const params = new URLSearchParams()
      params.append('trycode', this.code)
      var _this = this
      this.$axios.get('http://localhost:8080/imgvrifyControllerDefaultKaptcha/' + this.code, { withCredentials: true }).then(function(resp) {
        console.log(resp.data)
        if (resp.data) {
          _this.$refs.loginForm.validate(valid => {
            if (valid) {
              _this.loading = true
              _this.$store.dispatch('user/login', _this.loginForm)
                .then(() => {
                  _this.$router.push({ path: _this.redirect || '/', query: _this.otherQuery })
                  _this.loading = false
                })
                .catch(() => {
                  _this.loading = false
                })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else {
          _this.$message.error('验证码错误')
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }

  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }

  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 90%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }

    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    padding-top: 100px;
    width: 100%;
    height: 100%;
    /*<!--background-color: $bg;-->*/
    overflow: hidden;
    background: url("../../assets/login/login.png") no-repeat;
    background-size: cover;

    .login-form {
      position: relative;
      width: 520px;
      height: 500px;
      max-width: 100%;
      padding: 70px 55px 0;
      margin: 0 auto;
      overflow: hidden;
      /*box-shadow: 0 0 25px #cac6c6;*/
      border-radius: 10px;
    }
    .code-input{
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      width: 75%;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        /*<!--color: $light_gray;-->*/
        color: #edf3f5;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        cursor: pointer;
      }
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
