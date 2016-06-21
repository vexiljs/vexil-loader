const demo = require('./demo.vex')

window.onload = function () {
  const node = document.getElementById('demo')
  node.textContent = JSON.stringify(demo, null, 2)
}
