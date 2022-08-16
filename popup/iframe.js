console.log('iframe window.opener', window.opener)
console.log('iframe window.parent', window.parent)

window.parent.postMessage(
  'here’s a message for my dad',
  'chrome-extension://ofniiffbnieifjdgaeniekjkmnfgnmbb'
)
