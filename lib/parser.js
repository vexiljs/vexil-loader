const parse5 = require('parse5')
const cache = require('lru-cache')(100)
const hash = require('hash-sum')
const deindent = require('./de-indent')
const ejsonmlParse = require('./ejsonml')

const splitRE = /\r?\n/g

module.exports = function parse (content, filename) {
  const cacheKey = hash(filename + content)
  let output = cache.get(cacheKey)
  if (output) {
    return output
  }
  const fragment = parse5.parseFragment(content, {
    locationInfo: true,
  })
  let template, script, style, dom
  fragment.childNodes.forEach((node) => {
    let type = node.tagName
    if (type === 'template') {
      dom = node = node.content
      const start = node.childNodes[0].__location.startOffset
      const end = node.childNodes[node.childNodes.length - 1].__location.endOffset
      const lineOffset = content.slice(0, start).split(splitRE).length - 1
      template = deindent(content.slice(start, end))
      // pad whith whitespace so that error messages are correct
      template = Array(lineOffset + 1).join('\n') + template
    } else if (type === 'script') {
      script = node.childNodes[0].value
    } else if (type === 'style') {
      style = node.childNodes[0].value
    }
  })
  output = {
    dom: '\nmodule.exports=' + JSON.stringify(ejsonmlParse(dom)) + ';\n',
    html: template,
    js: script,
    css: style,
  }
  cache.set(cacheKey, output)
  return output
}
