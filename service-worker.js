// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log('service-worker.js loaded')

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.

chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
  console.log('onInstalled, reason:', reason, 'previousVersion:', previousVersion)
  initiateSubscription()
})

chrome.runtime.onStartup.addListener(() => {
  console.log('onStartup')
  initiateSubscription()
})

chrome.runtime.onSuspend.addListener(() => {
  // See about initiating an unsubscribe for the subscription, but since that’s
  // retrieved asynchronously, we might not be able to. The docs say:
  //
  //   “Note that since the page is unloading, any asynchronous operations
  //   started while handling this event are not guaranteed to complete.”

  console.log('onSuspend')
})

self.addEventListener('push', function(event) {
  console.log('Received push message: ', event)
})

async function initiateSubscription() {
  const subscription = await self.registration.pushManager.getSubscription()

  if (subscription) {
    console.log('Already subscribed!', subscription.endpoint)
    return
  }

  console.log('Not subscribed yet, subscribing…')
  subscribe()
}

async function subscribe() {
  const vapidPublicKey = 'BA6FsKnQSkEaHyww8ZJArtca-30SYPlq7034KJUc3PbHVyCQ9d8hzdwCkIgWQ6wC8uuEvm1IJm7hrht_qAAzLpc'
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

  const subscription = await self.registration.pushManager.subscribe({
    applicationServerKey: convertedVapidKey,
    userVisibleOnly: true,
  });

  console.log('Subscribed at', subscription.endpoint);

  fetch('http://localhost:3003/register', {
    // TODO: Include current account/user here, and access token to authorize
    body: JSON.stringify({ subscription }),
    headers: { 'Content-type': 'application/json' },
    method: 'post',
  })
    .then((response) => {
      console.log('Status: ', response.status)
    })
}
