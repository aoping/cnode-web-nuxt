const validator = require('validator')

export const checkName = (rule, value, callback) => {
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

export const checkPass = (rule, value, callback) => {
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

export const checkRePass = (rule, value, callback) => {
  setTimeout(() => {
    if (this.ruleForm.pass !== value) {
      callback(new Error('两次密码输入不一致。'))
    } else {
      callback()
    }
  }, 1000)
}

export const checkEmail = (rule, value, callback) => {
  setTimeout(() => {
    if (!validator.isEmail(value)) {
      callback(new Error('邮箱不合法。'))
    } else {
      callback()
    }
  }, 1000)
}
