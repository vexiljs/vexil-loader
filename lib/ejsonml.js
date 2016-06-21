module.exports = function parse (doc) {
  let tag = doc.nodeName
  if (doc.nodeName === '#document-fragment') {
    tag = 'template'
  }
  return [tag, parseAttributes(doc.attrs), parseChildren(doc.childNodes)]
}

function parseNode (node) {
  return [
    node.nodeName,
    parseAttributes(node.attrs),
    parseChildren(node.childNodes),
  ]
}

function parseChildren (nodes) {
  let childs = null
  if (nodes && nodes.length) {
    childs = []
    nodes.forEach(node => {
      if (node.nodeName === '#text') {
        childs.push(node.value)
      } else {
        childs.push(parseNode(node))
      }
    })
  }
  return childs
}

function parseAttributes (attrs) {
  let res = null
  if (attrs && attrs.length) {
    res = {}
    attrs.forEach(attr => {
      res[attr.name] = attr.value
    })
  }
  return res
}
