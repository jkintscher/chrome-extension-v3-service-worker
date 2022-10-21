const express = require('express')
const bodyParser = require('body-parser')
const webPush = require('web-push')

// Configure web-push

const keys = {
  privateKey: 'lLettub3VDaY0ci0XgbSHD6lCa0f0N8y7VAwSrEEO34',
  publicKey: 'BA6FsKnQSkEaHyww8ZJArtca-30SYPlq7034KJUc3PbHVyCQ9d8hzdwCkIgWQ6wC8uuEvm1IJm7hrht_qAAzLpc',
  subject: 'mailto: <joschka@getharvest.com>',
}

webPush.setVapidDetails(
  keys.subject,
  keys.publicKey,
  keys.privateKey
)

const subscriptions = {};

async function sendNotification(subscription) {
  const { endpoint } = subscription
  console.log(`Sending notification to ${endpoint}`)

  try {
    await webPush.sendNotification(subscription, 'My push event')
    console.log('Push Application Server - Notification sent to ' + endpoint)
  } catch (e) {
    console.log('ERROR in sending Notification, endpoint removed ' + endpoint)
    delete subscriptions[endpoint]
  }
}

setInterval(function() {
  const items = Object.values(subscriptions)
  console.log(`Pinging ${items.length} subscriptions`)
  items.forEach(sendNotification)
}, 5000)

// Configure middleware and routes

const app = express()

app.use(bodyParser.json())

app.use(function setServiceWorkerHeader(req, res, next) {
  if (req.url.endsWith('service-worker.js')) {
    res.header('Cache-control', 'public, max-age=0')
  }
  next()
})

app.post('/register', function(req, res) {
  try {
    console.log('/register')
    const subscription = req.body.subscription
    const { endpoint } = subscription

    if (!subscriptions[endpoint]) {
      console.log(`  Subscription registered: ${endpoint}`)
      subscriptions[endpoint] = subscription
    }

    res.sendStatus(201)
  } catch(e) {
    console.log('  Something broke:', e)
  }
})

app.post('/unregister', function(req, res) {
  console.log('/unregister')
  const subscription = req.body.subscription
  const { endpoint } = subscription

  if (subscriptions[endpoint]) {
    console.log(`  Subscription unregistered: ${endpoint}`)
    delete subscriptions[endpoint]
  }

  res.sendStatus(201)
})

const port = process.env.PORT || 3003

app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }

  console.log(`app.listen on http://localhost:${port}`)
})
