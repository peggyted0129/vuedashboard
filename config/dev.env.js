'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',  
  APIPATH: '"https://vue-course-api.hexschool.io"',  // 貼入伺服器路徑
  CUSTOMPATH: '"peggyted0129"',  // 貼入自訂義的路徑
})
