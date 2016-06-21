const path = require('path')
const loaderUtils = require('loader-utils')
const parse = require('./parser')

module.exports = function (content) {
  this.cacheable()
  const query = loaderUtils.parseQuery(this.query)
  const filename = path.basename(this.resourcePath)
  const parts = parse(content, filename, this.sourceMap)
  const part = parts[query.type]
  this.callback(null, part)
}
