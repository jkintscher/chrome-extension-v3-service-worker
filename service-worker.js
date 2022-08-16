// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.

async function initiateSubscription() {
  const subscription = await self.registration.pushManager.getSubscription()

  if (subscription) {
    console.log('Already subscribed!', subscription.endpoint)
    return
  }

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
