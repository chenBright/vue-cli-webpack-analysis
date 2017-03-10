# vue-cli-webpack-analysis

[vue-cli](https://github.com/vuejs/vue-cli) webpack配置的分析（注释）。这里有一篇简单的[文章](https://segmentfault.com/a/1190000008644830)。

## 说明

此仓库为`vue-cli webpack`的配置分析，其实只是在源码中加上注释而已。大家查看详细分析，可以从后面提到的入口文件开始查看。

分析不包括`check-versions.js`文件，因为`check-versions.js`是检测`npm`和`node`版本，不涉及`webpack`，所以就没有对`check-versions.js`进行分析。同时，也不包括测试部分的代码，该分析只是针对开发和生产环境的`webpack`配置进行分析。


## vue-cli 版本

2.8.1

## 入口

从`package.json`可以看到开发和生产环境的入口。

```javascript
  "scripts": {
    "dev": "node build/dev-server.js",
    "build": "node build/build.js"
  }
```

## 开发环境

开发环境的入口文件是[`build/dev-server.js`](https://github.com/chenBright/vue-cli-webpack-analysis/blob/master/build/dev-server.js)。

## 生产环境

开发环境的入口文件是[`build/build.js `](https://github.com/chenBright/vue-cli-webpack-analysis/blob/master/build/build.js)。

## 配置文件

`config`文件夹下的文件为配置文件，包含了开发和生产环境的一些配置，例如静态文件的路径、是否开启sourceMap等。