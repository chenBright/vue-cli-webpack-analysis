/* eslint-disable */

// Hol-reload 热重载
// 主要是在html文件改变时，强制刷新浏览器

// eventsource polyfill，为不支持 EventSource 的浏览器提供支持
// https://github.com/amvtek/EventSource
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

// Hot-reload 热重载插件 client客户端模块
hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
