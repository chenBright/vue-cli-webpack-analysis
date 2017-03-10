// 工具函数集合
var utils = require('./utils')
var webpack = require('webpack')
// 配置文件
var config = require('../config')
// webpack 配置合并插件
var merge = require('webpack-merge')
// webpac基本配置
var baseWebpackConfig = require('./webpack.base.conf')
// 自动生成 html 并且注入到 .html 文件中的插件
// https://github.com/ampedandwired/html-webpack-plugin
var HtmlWebpackPlugin = require('html-webpack-plugin')
// webpack 错误信息提示插件
// https://github.com/geowarin/friendly-errors-webpack-plugin
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// 将 Hol-reload 热重载的客户端代码添加到 webpack.base.conf 的 对应 entry 中，一起打包
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    // styleLoaders
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // 最新的配置为 cheap-module-eval-source-map，虽然 cheap-module-eval-source-map 更快，但它的定位不准确
  // 所以，换成 eval-source-map
  devtool: '#eval-source-map',
  plugins: [
    // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
    // 此处，插入适当的环境
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // HotModule 插件在页面进行变更的时候只会重绘对应的页面模块，不会重绘整个 html 文件
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // 将 index.html 作为入口，注入 html 代码后生成 index.html 文件
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // webpack 错误信息提示插件
    new FriendlyErrorsPlugin()
  ]
})
