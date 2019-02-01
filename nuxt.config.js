const pkg = require('./package')


module.exports = {
  mode: 'universal',
  NODE_ENV: process.env.NODE_ENV,
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/iconfont.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/filters'
  ],
  // proxy: {
  //   // Simple proxy
  //   '/api': 'http://127.0.0.1:7001/api',

  //   // With options
  //   // '/api2': { target: 'http://example.com', ws: false }
  // },
  proxy: {
    //开启代理
    "/api/": {
      target: "http://127.0.0.1:7001/api",
      pathRewrite: {
        "^/api/": ""
      }
    }
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/proxy'
  ],
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    babel: {
      'plugins': [
        ['module-resolver', {
          'alias': {
            '@': `${__dirname}/`,
            '~': `${__dirname}/`
          }
        }]
      ]
    }
    /*
     ** You can extend webpack config here
     */
    // extend(config, ctx) {
    //   // Run ESLint on save
    //   if (ctx.isDev && ctx.isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // }
  }
}
