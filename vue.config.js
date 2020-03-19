const CompressionPlugin = require('compression-webpack-plugin')
// 插件引入
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
// 需要压缩的文件类型
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
  },
  chainWebpack: (config) => {
    // 配置分析工具
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
      }
    }
  },
  // 配置gzip
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new CompressionPlugin({
        algorithm: 'gzip',
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8
      })
      )
    }
  }
}
