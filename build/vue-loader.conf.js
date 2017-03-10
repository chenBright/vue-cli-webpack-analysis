// 工具函数集合
var utils = require('./utils')
// 配置文件
var config = require('../config')
// 是否为生产环境
var isProduction = process.env.NODE_ENV === 'production'

// vue-loader的配置
// https://github.com/vuejs/vue-loader
module.exports = {
  loaders: utils.cssLoaders({
    // sourceMap
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    // 提取出独立的文件
    extract: isProduction
  })
}
