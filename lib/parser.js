const cache = require('lru-cache')(100)
const hash = require('hash-sum')
const Parser = require('ejsonml-parser')
const EjmlParser = require('ejsonml-parser-javascript')

const templateRE = /<template>((.|\n|\r)*)<\/template>/gim
const scriptRE = /<script>((.|\n|\r)*)<\/script>/gim
const styleRE = /<style>((.|\n|\r)*)<\/style>/gim

let jml
const parser = new Parser()
parser.install(new EjmlParser({
  callback (j) {
    jml = j
  },
}))

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
  const ejml = parser.parse(template)
  output = {
    jml: 'module.exports=' + jml,
    ejml: 'module.exports=' + JSON.stringify(ejml),
    html: template,
    js: script,
    css: style,
  }
  cache.set(cacheKey, output)
  return output
}
