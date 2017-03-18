// node自带的文件路径工具
var path = require('path')
// 工具函数集合
var utils = require('./utils')
var webpack = require('webpack')
// 配置文件
var config = require('../config')
// webpack 配置合并插件
var merge = require('webpack-merge')
// webpack 基本配置
var baseWebpackConfig = require('./webpack.base.conf')
// webpack 复制文件和文件夹的插件
// https://github.com/kevlened/copy-webpack-plugin
var CopyWebpackPlugin = require('copy-webpack-plugin')
// 自动生成 html 并且注入到 .html 文件中的插件
// https://github.com/ampedandwired/html-webpack-plugin
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 提取css的插件
// https://github.com/webpack-contrib/extract-text-webpack-plugin
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// webpack 优化压缩和优化 css 的插件
// https://github.com/NMFR/optimize-css-assets-webpack-plugin
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

// 如果当前环境为测试环境，则使用测试环境
// 否则，使用生产环境
var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    // styleLoaders
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  // 是否开启 sourceMap
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    // 编译输出的静态资源根路径
    path: config.build.assetsRoot,
    // 编译输出的文件名
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // 没有指定输出名的文件输出的文件名
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
    // 此处，插入适当的环境
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 压缩 js
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // 提取 css
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // 压缩提取出来的 css
    // 可以删除来自不同组件的冗余代码
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(),
    // 将 index.html 作为入口，注入 html 代码后生成 index.html文件
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // 更多选项 https://github.com/kangax/html-minifier#options-quick-reference
      },
      // 必须通过 CommonsChunkPlugin一致地处理多个 chunks
      chunksSortMode: 'dependency'
    }),
    // 分割公共 js 到独立的文件
    // https://webpack.js.org/guides/code-splitting-libraries/#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // node_modules中的任何所需模块都提取到 vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // 将 webpack runtime 和模块清单 提取到独立的文件，以防止当 app 包更新时导致公共 jsd hash 也更新
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // 复制静态资源
    // https://github.com/kevlened/copy-webpack-plugin
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

// 开启 gzip 的情况时，给 webpack plugins 添加 compression-webpack-plugin 插件
if (config.build.productionGzip) {
    // webpack 压缩插件
    // https://github.com/webpack-contrib/compression-webpack-plugin
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  // 向 webpackconfig.plugins 中加入下方的插件
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

// 开启包分析的情况时， 给 webpack plugins 添加 webpack-bundle-analyzer 插件
if (config.build.bundleAnalyzerReport) {
  // https://github.com/th0r/webpack-bundle-analyzer
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
