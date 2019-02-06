import mongoose from 'mongoose'
import {
  validateId,
  bhash,
  bcompare,
  makeGravatar
} from '../utils/helper'
const Router = require('koa-router')
const validator = require('validator')
const uuid = require('uuid');

const User = mongoose.model('User')

export default app => {
  const router = new Router()
  const log = async (ctx, next) => {
    console.time(`${ctx.method} ${ctx.url}`)
    await next()
    console.timeEnd(`${ctx.method} ${ctx.url}`)
  }

  router.post('/api/v1/signup', async (ctx, next) => {
    const loginname = validator.trim(ctx.request.body.loginname || '').toLowerCase()
    const email = validator.trim(ctx.request.body.email || '').toLowerCase()
    const pass = validator.trim(ctx.request.body.pass || '')
    const rePass = validator.trim(ctx.request.body.re_pass || '')
    let msg;
    // 验证信息的正确性
    if ([loginname, pass, rePass, email].some(item => {
        return item === ''
      })) {
      msg = '信息不完整。'
    } else if (loginname.length < 5) {
      msg = '用户名至少需要5个字符。'
    } else if (!validateId(loginname)) {
      msg = '用户名不合法。'
    } else if (!validator.isEmail(email)) {
      msg = '邮箱不合法。'
    } else if (pass !== rePass) {
      msg = '两次密码输入不一致。'
    }
    // END 验证信息的正确性

    if (msg) {
      ctx.status = 422
      ctx.body = {
        success: false,
        msg: msg,
        loginname,
        email,
      }
      return;
    }

    const users = await User.find({
      $or: [{
          loginname
        },
        {
          email
        },
      ]
    }).exec()

    if (users.length > 0) {
      ctx.status = 422
      ctx.body = {
        success: false,
        msg: '用户名或邮箱已被使用。',
        loginname,
        email,
      }
      return
    }
    const passhash = bhash(pass)

    // create gravatar
    const avatarUrl = makeGravatar(email);

    let user = new User()
    user.name = loginname
    user.loginname = loginname
    user.pass = passhash
    user.email = email
    user.avatar = avatarUrl
    user.active = true
    user.accessToken = uuid.v4()
    await user.save()
    // 发送激活邮件
    // await service.mail.sendActiveMail(email, utility.md5(email + passhash + config.session_secret), loginname);
    ctx.body = {
        success: true,
        msg: '注册成功',
        loginname,
        email,
    }
  })

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
