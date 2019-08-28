'use strict'

const fs = require('fs')
const H = require('highland')

const {logEntry: logEntryDomain} = require('../../../domain/entity')
const Index = `${__dirname}/resources/epa-http.txt`

const importFromStoredFile = () => {
  const readStream = fs.createReadStream(Index)
  return H(readStream).split().invoke('toString', ['utf8']).on('data', logEntryDomain.create)
}

module.exports = {
  importFromStoredFile
}
