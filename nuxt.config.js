import { resolve } from 'path'

export default {
  mode: 'spa',
  srcDir: 'src',
  env: {
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    FIREBASE_APIKEY: process.env.FIREBASE_APIKEY,
    FIREBASE_AUTHDOMAIN: process.env.FIREBASE_AUTHDOMAIN,
    FIREBASE_DATABASEURL: process.env.FIREBASE_DATABASEURL,
    FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
    FIREBASE_STORAGEBUCKET: process.env.FIREBASE_STORAGEBUCKET,
    FIREBASE_MESSAGINGSENDERID: process.env.FIREBASE_MESSAGINGSENDERID,
    FIREBASE_APPID: process.env.FIREBASE_APPID
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  generate: {
    fallback: true
  },
  loading: { color: '#fff' },
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/styles/common.styl'
  ],
  plugins: [
    '@/plugins/ga',
    '@/plugins/firebase',
    '@/plugins/element-ui',
    '@/plugins/vue-composition-api',
    '@/plugins/vue-awesome',
    '@/plugins/vue-markdown'
  ],
  buildModules: [
    '@nuxt/typescript-build',
    ['@nuxtjs/google-analytics', { id: process.env.GA_TRACKING_ID }]
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    ['nuxt-stylus-resources-loader', [
      resolve(__dirname, 'src/styles/scroll-shadow.styl'),
      resolve(__dirname, 'src/styles/common-mixins.styl')
    ]]
  ],
  axios: {
  },
  build: {
    transpile: [/^element-ui/],
    extend (config, _ctx) {
      config.module.rules.push({
        test: /\.md$/,
        loader: 'raw-loader'
      })
    }
  }
}
