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

// Configure middleware and routes

const app = express()

app.use(bodyParser.json())

const port = process.env.PORT || 3003

app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }

  console.log(`app.listen on http://localhost:${port}`)
})
