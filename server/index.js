import {
  resolve
} from 'path'
import R from 'ramda'
const Koa = require('koa')
const Router = require('koa-router')
const consola = require('consola')
const passport = require('koa-passport')

const {
  Nuxt,
  Builder
} = require('nuxt')
const r = path => resolve(__dirname, path)

const MIDDLEWARE = ['database', 'general', 'router']

const app = new Koa()

const useMiddleware = (app) => {
  return R.map(R.compose(
    R.map(i => i(app)),
    require,
    i => `${r('./middleware')}/${i}`))
}

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
      port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  await useMiddleware(app)(MIDDLEWARE)

  // authentication
  require('./auth')
  app.use(passport.initialize())
  // app.use(passport.session())

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
