import mongoose from 'mongoose'
import {
  incrementScoreAndReplyCount
} from '../database/services/user'

import {
  getTopicsByQuery
} from '../database/services/topic'

import {
  validateId,
  bhash,
  bcompare,
  makeGravatar
} from '../utils/helper'

import {
  markdown,
} from '../utils/markdown'
import {
  token_required,
  pagination,
} from './middleware'
const Router = require('koa-router')
const validator = require('validator')
const uuid = require('uuid');
const _ = require('lodash')
const User = mongoose.model('User')
const Topic = mongoose.model('Topic')


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
    user.accesstoken = uuid.v4()
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

  router.post('/api/v1/login', async (ctx, next) => {
    const loginname = validator.trim(ctx.request.body.loginname || '').toLowerCase()
    const pass = validator.trim(ctx.request.body.pass || '')
    let existUser

    if (loginname.indexOf('@') > 0) {
      existUser = await User.findOne({
        email: loginname
      }).exec()
    } else {
      existUser = await User.findOne({
        loginname
      }).exec()
    }
    // 用户不存在
    if (!existUser) {
      ctx.body = {
        success: false,
        msg: '用户不存在'
      }
    }

    const passhash = existUser.pass
    // TODO: change to async compare
    const equal = bcompare(pass, passhash)
    // 密码不匹配
    if (!equal) {
      ctx.body = {
        success: false,
        msg: '密码不匹配'
      }
    }

    // 用户未激活
    if (!existUser.active) {
      // 发送激活邮件
      ctx.body = {
        success: false,
        msg: '未激活'
      }
    }
    // {success: true, loginname: req.user.loginname, id: req.user.id, avatar_url: req.user.avatar_url}
    // 验证通过
    const {
      id,
      avatar_url,
      accesstoken
    } = existUser
    ctx.body = {
      success: true,
      loginname,
      id,
      avatar_url,
      accesstoken
    }
  })

  // 新建主题
  router.post('/api/v1/topics', token_required(), async (ctx, next) => {
    const {
      title,
      content,
      tab
    } = ctx.request.body

    // 储存新主题帖
    const topic = new Topic({
      title,
      content,
      tab,
      author_id: ctx.request.user.id
    })

    await topic.save()

    // 发帖用户增加积分,增加发表主题数量
    await incrementScoreAndReplyCount(topic.author_id, 5, 1)

    // 通知被@的用户
    // await ctx.service.at.sendMessageToMentionUsers(
    //   body.content,
    //   topic.id,
    //   ctx.request.user.id
    // );

    ctx.body = {
      success: true,
      topic_id: topic.id,
    }
  })

  // 获取
  router.get('/api/v1/topics', pagination(), async (ctx, next) => {
    const tab = ctx.query.tab || 'all';
    const mdrender = ctx.query.mdrender !== 'false';

    const query = {}
    if (!tab || tab === 'all') {
      query.tab = {
        $nin: ['job', 'dev']
      }
    } else {
      if (tab === 'good') {
        query.good = true
      } else {
        query.tab = tab
      }
    }

    let topics = await getTopicsByQuery(query,
      // TODO 修改 eslint 支持在 {} 内使用 ...，栗子：{ sort: '-top -last_reply_at', ...ctx.pagination }
      Object.assign({
        sort: '-top -last_reply_at'
      }, ctx.pagination))
    topics = topics.map(topic => {
      topic.content = mdrender ? markdown(topic.content) : topic.content;
      topic.author = _.pick(topic.author, ['loginname', 'avatar_url']);
      topic.id = topic._id;
      return _.pick(topic, ['id', 'author_id', 'tab', 'content', 'title', 'last_reply_at',
        'good', 'top', 'reply_count', 'visit_count', 'create_at', 'author'
      ]);
    });

    ctx.body = {
      success: true,
      data: topics,
    };
  })

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
