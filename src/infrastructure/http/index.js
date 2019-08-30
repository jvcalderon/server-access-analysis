'use strict'

const config = require('../../config').express
const data = require('../persistence/fileDataSource/resources/epa-http.json')

const express = require('express')
const app = express()
const http = require('http').Server(app)

app.get('/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
})

app.use('/', express.static(__dirname + '/../../application/dashboard/public'))

http.listen(config.port, () => console.log(`Listening on port ${config.port}!`))

module.exports = {app}
