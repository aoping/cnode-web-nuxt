import mongoose from 'mongoose'
import config from '../config'
const User = mongoose.model('User')

export const token_required = () => {
  return async function (ctx, next) {
    console.log('00000')
    console.log(ctx.request.body)
    let token = '';
    if (
      ctx.headers.authorization && ctx.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      token = ctx.headers.authorization.split(' ')[1];
    } else if (ctx.query.accesstoken) {
      token = ctx.query.accesstoken;
    } else if (ctx.request.body.accesstoken) {
      token = ctx.request.body.accesstoken;
    }

    const user = await User.findOne({
      accesstoken: token
    });

    if (!user) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        msg: '错误的 accessToken',
      };
      return;
    }

    if (user.is_block) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        msg: '您的账户被禁用',
      };
      return;
    }

    ctx.request.user = user

    await next();
  };
};


export const pagination = () => {
  return async (ctx, next) => {
    if (!ctx.pagination) {

      const query = ctx.query
      const pagination = {}

      // 这里限制了最大 limit，不知道实际上需不需要
      pagination.limit = Math.min(100, parseInt(query.limit || config.default_limit, 10));
      const page = Math.max(1, parseInt(query.page || config.default_page, 10));
      pagination.skip = (page - 1) * pagination.limit;

      ctx.pagination = pagination;
    }
    await next();
  };
};
