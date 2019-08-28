'use strict'

const fs = require('fs')
const H = require('highland')

const {logEntry: logEntryDomain} = require('../../../domain/entity')
const STORED_LOG_FILE = `${__dirname}/resources/epa-http.txt`

const readStoredFileStream = () => {
  const readStream = fs.createReadStream(STORED_LOG_FILE)
  return H(readStream).split().invoke('toString', ['utf8']).map(logEntryDomain.create)
}

const jsonFileWriteStream = file => fs.createWriteStream(file, {flags: 'a'})

module.exports = {
  readStoredFileStream,
  jsonFileWriteStream
}
