const Gep = require('gep')

module.exports = hsParse

const gep = new Gep()
const commentRE = /^<!--.*-->$/
const boundMap = {
  'class': ' ',
  'style': ';',
}
const childMap = {
  'text': true,
}

let toRuntime

function hsParse (ejml, debug) {
  toRuntime = !debug
  let parsed = translate(ejml)
  let hs = h(parsed)
  return hs
}

function translate (ejml) {
  if (!ejml) {
    return ''
  } else if (Array.isArray(ejml)) {
    let child = parseAttributes(ejml[1])
    if (child) {
      ejml[2] = [child]
    } else {
      ejml[2] = ejml[2]
               .filter(child => !commentRE.test(child))
               .map(child => translate(child))
    }
  }
  return ejml
}

function parseAttributes (attributes) {
  let bindAttr, attr, child
  Object.keys(attributes).forEach(key => {
    if (key[0] === ':') {
      bindAttr = attributes[key]
      delete attributes[key]
      key = key.slice(1)
      attr = getTrimmedAttribute(attributes, key)
      if (attr) {
        bindAttr = `'${attr}'+(${bindAttr})`
      }
      bindAttr = gep.parse(bindAttr)
      bindAttr = gep.make(bindAttr, toRuntime)
      if (childMap[key]) {
        child = bindAttr
      } else {
        attributes[key] = bindAttr
      }
    }
  })
  return child
}

function getTrimmedAttribute (attributes, key) {
  if (!attributes.hasOwnProperty(key)) return
  let attr = attributes[key]
  attr = attr.trim()
  let bound = boundMap[key]
  if (bound && attr[attr.length - 1] !== bound) {
    attr += bound
  }
  return attr
}

function h (ejml) {
  if (Array.isArray(ejml)) {
    return `h('${ejml[0]}',${JSON.stringify(ejml[1]).replace(/"/g, '\'')},${walk(ejml[2])})`
  } else {
    return `'${ejml.replace(/\s/g, '')}'`
  }
}

function walk (childs) {
  return `[${childs.map(child => h(child)).join(',')}]`
}
