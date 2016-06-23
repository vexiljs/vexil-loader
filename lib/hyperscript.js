const Gep = require('gep')

module.exports = hsParse

const gep = new Gep({
  scopes: {
    '_': ['$index', '$event'],
  },
})
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
  return translate(ejml)
}

function translate (ejml) {
  if (Array.isArray(ejml)) {
    let childs
    let attrs = parseAttributes(ejml[1], text => {
      childs = text
    })
    if (childs) {
      childs = '[' + childs + ']'
    } else {
      childs = walk(ejml[2])
    }
    return `h('${ejml[0]}',${attrs},${childs})`
  } else {
    return `'${ejml.trim()}'`
  }
}

function walk (childs) {
  if (!childs.length) {
    return 'null'
  }
  return `[${childs
    .map(child => translate(child))
    .filter(child => child && child !== '\'\'')
    .join(',')}]`
}

function parseAttributes (attributes, cb) {
  let keys = Object.keys(attributes)
  if (!keys.length) {
    return 'null'
  }
  let attrs = {}
  let bindAttrs = {}
  let attr, child, slicedKey
  keys.forEach(key => {
    switch (key[0]) {
      case ':':
        slicedKey = key.slice(1)
        attr = getTrimmedAttribute(attributes, slicedKey)
        if (attr) {
          attr = `'${attr}'+(${attributes[key]})`
        } else {
          attr = attributes[key]
        }
        attr = gep.make(gep.parse(attr), toRuntime)
        if (childMap[slicedKey]) {
          child = attr
        } else {
          bindAttrs[slicedKey] = slicedKey + ':' + attr
        }
        break
      default:
        attrs[key] = key + ':\'' + attributes[key] + '\''
    }
  })
  if (child) {
    cb(child)
  }
  return '{'
    + Object.keys(Object.assign(attrs, bindAttrs))
      .map(key => attrs[key])
      .join(',')
    + '}'
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
