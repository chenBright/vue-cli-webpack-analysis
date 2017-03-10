// node自带的文件路径工具
var path = require('path')
// 配置文件
var config = require('../config')
// 提取 css 的插件
// https://github.com/webpack-contrib/extract-text-webpack-plugin
var ExtractTextPlugin = require('extract-text-webpack-plugin')

/**
 * 生成静态资源的路径
 * @method assertsPath
 * @param  {String}    _path 相对于静态资源文件夹的文件路径
 * @return {String}          静态资源完整路径
 */
exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
    //  path.posix.join与path.join一样，不过总是以 posix 兼容的方式交互
  return path.posix.join(assetsSubDirectory, _path)
}

/**
 * 生成处理css的loaders配置
 * @method cssLoaders
 * @param  {Object}   options 生成配置
 *                            option = {
 *                              // 是否开启 sourceMap
 *                              sourceMap: true,
 *                              // 是否提取css
 *                              extract: true
 *                            }
 * @return {Object}           处理css的loaders配置对象
 */
exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }
  /**
   * 生成 ExtractTextPlugin对象或loader字符串
   * @method generateLoaders
   * @param  {Array}        loaders loader名称数组
   * @return {String|Object}        ExtractTextPlugin对象或loader字符串
   */
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        // 例如，sass?indentedSyntax
        // 在?号前加上“-loader”
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // extract为true时，提取css
    // 生产环境中，默认为true
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

/**
 * 生成 style-loader的配置
 * style-loader文档：https://github.com/webpack/style-loader
 * @method styleLoaders
 * @param  {Object}     options 生成配置
 *                              option = {
 *                                // 是否开启 sourceMap
 *                                sourceMap: true,
 *                                // 是否提取css
 *                                extract: true
 *                              }
 * @return {Array}              style-loader的配置
 */
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
