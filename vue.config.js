module.exports = {
  lintOnSave: true,
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/hehe': {
        target: 'http://ustbhuangyi.com',
        changeOrigin: true,
        pathRewrite: {
          '^/hehe': ''
        }
      },
      '/music': {
        target: 'http://47.95.207.1:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/music': ''
        }
      }
    }
  }
}
