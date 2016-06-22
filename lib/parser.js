const cache = require('lru-cache')(100)
const hash = require('hash-sum')
const ejsonmlParse = require('./ejsonml')
const hyperscriptParse = require('./hyperscript')

const templateRE = /<template>((.|\n|\r)*)<\/template>/gim
const scriptRE = /<script>((.|\n|\r)*)<\/script>/gim
const styleRE = /<style>((.|\n|\r)*)<\/style>/gim

module.exports = function parse (content, filename) {
  const cacheKey = hash(filename + content)
  let output = cache.get(cacheKey)
  if (output) {
    return output
  }
  let template, script, style
  content = content.replace(templateRE, (t, s) => {
    template = s
    return ''
  })
  content = content.replace(scriptRE, (t, s) => {
    script = s
    return ''
  })
  content = content.replace(styleRE, (t, s) => {
    style = s
    return ''
  })
  let ejml = ejsonmlParse(template)
  let hs = hyperscriptParse(ejml)
  output = {
    hs: `\nmodule.exports=function render(h){return ${hs}};\n`,
    ejml: JSON.stringify(ejml),
    html: template,
    js: script,
    css: style,
  }
  cache.set(cacheKey, output)
  return output
}
