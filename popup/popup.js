console.log('window.location.href', window.location.href)
console.log('chrome.runtime.id', chrome.runtime.id)

window.addEventListener('message', function(message) {
  console.log('received a message:', message)
})
