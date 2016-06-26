const demo = require('./demo.vex')

window.onload = function () {
  const node = document.getElementById('demo')
  node.textContent = JSON.stringify(demo, function (key, val) {
    if (typeof val === 'function') {
      return val.toString()
    }
    return val
  }, 2)
}
