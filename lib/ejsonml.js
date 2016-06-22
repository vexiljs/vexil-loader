const htmlparser = require('htmlparser2')

module.exports = parse

let stack, v

const parser = new htmlparser.Parser({
  onopentag (name, attribs) {
    v = [name, attribs, [], stack]
    stack[2].push(v)
    stack = v
  },
  ontext (text) {
    stack[2].push(text)
  },
  onclosetag (tagname) {
    stack = stack.pop()
  },
  oncomment (text) {
    stack[2].push(`<!--${text}-->`)
  },
}, {
  decodeEntities: true,
})

function parse (template) {
  stack = [undefined, undefined, []]
  template = template.trim()
  parser.write(template)
  parser.end()
  return stack[2][0]
}
