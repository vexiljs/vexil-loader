const selectorPath = require.resolve('./selector')

module.exports = function vexilLoader (source) {
  this.cacheable()
  const file = this.resourcePath
  const output =
`
var __VEXIL_SCRIPT__;
__VEXIL_SCRIPT__ = require('!!babel!${selectorPath}?type=js!${file}');
__VEXIL_SCRIPT__.$template = require('!!${selectorPath}?type=dom!${file}');
module.exports = __VEXIL_SCRIPT__;
require('!!style!css!${selectorPath}?type=css!${file}');
`
  return output
}
