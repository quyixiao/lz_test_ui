const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/doc/',
  outputDir: 'dist/doc',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/lt-web/': {
        target: 'http://127.0.0.1:8080', // 本地测试环境
        changeOrigin: true
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
