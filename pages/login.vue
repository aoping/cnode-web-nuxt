<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <nuxt-link to="/login">登录</nuxt-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
      <el-form-item label="accesstoken" prop="accesstoken">
        <el-input v-model="ruleForm.accesstoken"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
      </el-form-item>
      <el-alert
        title="如何获取 accessToken？ 用户登录后，在设置页面可以看到自己的 accessToken。 建议各移动端应用使用手机扫码的形式登录，验证使用 /accesstoken 接口，登录后长期保存 accessToken"
        type="success"
      ></el-alert>
    </el-form>
  </div>
</template>

<script>
import { accesstoken } from '@/api'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      ruleForm: {
        accesstoken: ''
      },
      rules: {
        accesstoken: [
          { required: true, message: '请输入accessToken', trigger: 'blur' },
          { min: 36, max: 36, message: '长度为36个字符', trigger: 'blur' }
        ]
      }
    }
  },
  components: {},
  methods: {
    ...mapActions(['setUserInfo']),
    async submitForm(formName) {
      try {
        const result = await this.$refs[formName].validate()
        if (result) {
          const res = await accesstoken(this.ruleForm.accesstoken)
          console.log(res)
          if (res) {
            res.accesstoken = this.ruleForm.accesstoken
            this.setUserInfo(res)
            window.window.sessionStorage.user = JSON.stringify(res)
            if (this.redirectUrl) this.$router.push(this.redirectUrl)
            else this.$router.push('/')
          } else {
            this.$message.error('Access Token不正确')
          }
        } else {
          this.$message.error('Access Token不正确')
        }
      } catch (e) {
        this.$message.error('Access Token不正确')
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
