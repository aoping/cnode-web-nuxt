<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <nuxt-link to="/signup">注册</nuxt-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
      <el-form-item label="用户名" prop="loginname">
        <el-input v-model="ruleForm.loginname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="ruleForm.pass" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pass">
        <el-input v-model="ruleForm.re_pass" type="password"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="ruleForm.email" type="email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { signup } from '@/api'
import { mapActions } from 'vuex'
const validator = require('validator')

export default {
  data() {
    const checkName = (rule, value, callback) => {
      if (!value || value.length < 5) {
        return callback(new Error('用户名至少需要5个字符。'))
      }
      setTimeout(() => {
        if (!/^[a-zA-Z0-9\-_]+$/i.test(value)) {
          callback(new Error('用户名不合法。'))
        } else {
          callback()
        }
      }, 1000)
    }

    const checkPass = (rule, value, callback) => {
      if (!value || value.length < 5) {
        return callback(new Error('密码至少需要6个字符。'))
      }
      setTimeout(() => {
        if (!/^[a-zA-Z0-9\-_]+$/i.test(value)) {
          callback(new Error('密码只能是字母数字或者_'))
        } else {
          callback()
        }
      }, 1000)
    }

    const checkRePass = (rule, value, callback) => {
      setTimeout(() => {
        if (this.ruleForm.pass !== value) {
          callback(new Error('两次密码输入不一致。'))
        } else {
          callback()
        }
      }, 1000)
    }

    const checkEmail = (rule, value, callback) => {
      setTimeout(() => {
        if (!validator.isEmail(value)) {
          callback(new Error('邮箱不合法。'))
        } else {
          callback()
        }
      }, 1000)
    }

    return {
      ruleForm: {
        loginname: '',
        pass: '',
        re_pass: '',
        email: ''
      },
      rules: {
        loginname: [{ validator: checkName, trigger: ['blur', 'change'] }],
        pass: [{ validator: checkPass, trigger: ['blur', 'change'] }],
        re_pass: [{ validator: checkRePass, trigger: ['blur', 'change'] }],
        email: [{ validator: checkEmail, trigger: ['blur', 'change'] }]
      }
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
          const res = await signup(this.ruleForm)
          console.log(res)
          if (res && res.success) {
            this.$router.push('/login')
          } else {
            this.$message.error(res.msg)
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
