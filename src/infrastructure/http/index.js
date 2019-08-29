'use strict'

const config = require('../../config').express
const data = require('../persistence/fileDataSource/resources/epa-http.json')

const app = require('express')()
const http = require('http').Server(app)

app.get('/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
})

http.listen(config.port, () => console.log(`Listening on port ${config.port}!`))

module.exports = { app }
