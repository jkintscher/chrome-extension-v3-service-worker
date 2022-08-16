const express = require('express')
const bodyParser = require('body-parser')

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
