<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <nuxt-link to="/login">登录</nuxt-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
      <el-form-item label="用户名/邮箱" prop="loginname">
        <el-input v-model="ruleForm.loginname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="ruleForm.pass" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button>
          <a href="/auth/github">通过GitHub登录</a>
        </el-button>
      </el-form-item>
      <!-- <el-alert
        title="如何获取 accessToken？ 用户登录后，在设置页面可以看到自己的 accessToken。 建议各移动端应用使用手机扫码的形式登录，验证使用 /accesstoken 接口，登录后长期保存 accessToken"
        type="success"
      ></el-alert>-->
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api'
import { mapActions } from 'vuex'
import { checkName, checkPass } from '@/utils/validator'

export default {
  data() {
    return {
      ruleForm: {
        loginname: '',
        pass: ''
      },
      rules: {
        loginname: [{ validator: checkName, trigger: ['blur', 'change'] }],
        pass: [{ validator: checkPass, trigger: ['blur', 'change'] }]
      }
    }
  },
  mounted() {
    const res = this.$route.query.user
      ? JSON.parse(this.$route.query.user)
      : null

    if (res) {
      this.setUserInfo(res)
      window.window.sessionStorage.user = JSON.stringify(res)
      if (this.redirectUrl) this.$router.push(this.redirectUrl)
      else this.$router.push('/')
    }
  },
  components: {},
  methods: {
    ...mapActions(['setUserInfo']),
    async submitForm(formName) {
      try {
        const result = await this.$refs[formName].validate()
        console.log(result)
        if (result) {
          const res = await login(this.ruleForm)
          console.log(res)
          if (res) {
            this.setUserInfo(res)
            window.window.sessionStorage.user = JSON.stringify(res)
            if (this.redirectUrl) this.$router.push(this.redirectUrl)
            else this.$router.push('/')
          } else {
            this.$message.error('用户名或密码不对')
          }
        } else {
          this.$message.error('校验不通过，请检查所填字段')
        }
      } catch (e) {
        this.$message.error('校验不通过，请检查所填字段')
      }
    }
  }
}
</script>

<style scoped>
.breadcrumb {
  padding: 20px;
  background-color: #f6f6f6;
}
.ruleForm {
  padding: 20px;
  background-color: #f6f6f6;
}
</style>
<style>
.el-form-item__content {
  margin-left: 150px !important;
}
.el-input__inner {
  width: 500px;
}
</style>
