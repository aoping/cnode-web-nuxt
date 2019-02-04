const Router = require('koa-router')

export default app => {
  const router = new Router()
  router.get('/api', (ctx, next) => {
    ctx.body = '/aaa'
  })
  app
    .use(router.routes())
    .use(router.allowedMethods())
}
