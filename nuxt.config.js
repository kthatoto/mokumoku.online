import { resolve } from 'path'

export default {
  mode: 'spa',
  srcDir: 'src',
  env: {
    GA_TRACKING_ID: process.env.GA_TRACKING_ID
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
    '@/plugins/element-ui',
    '@/plugins/vue-composition-api',
    '@/plugins/vue-awesome',
    '@/plugins/vue-markdown',
    '@/plugins/vue-long-click'
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
      resolve(__dirname, 'src/styles/markdown.styl'),
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
