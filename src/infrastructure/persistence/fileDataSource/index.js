'use strict'

const fs = require('fs')
const H = require('highland')

const {logEntry: logEntryDomain} = require('../../../domain/entity')
const STORED_LOG_FILE = `${__dirname}/resources/epa-http.txt`
const OUTPUT_LOG_FILE = `${__dirname}/resources/epa-http.json`

const readFileStream = (file = STORED_LOG_FILE) => {
  const SEPARATOR = ",\n"
  const readStream = fs.createReadStream(file)
  return H(readStream)
    .split()
    .invoke('toString', ['utf8'])
    .filter(x => x !== '')
    .map(logEntryDomain.create)
    .filter(x => !!x)
    .intersperse(SEPARATOR)
    .map(x => x !== SEPARATOR ? JSON.stringify(x) : x)
    .filter(x => x !== 'false') // Avoid wrong rows
}

const jsonFileWriteStream = (file = OUTPUT_LOG_FILE) => {
  fs.writeFileSync(file, '[\n')
  return fs.createWriteStream(file, {flags: 'a'}).on('finish', () => fs.appendFileSync(file, '\n]\n'))
}

const loadFile = (inputFile = STORED_LOG_FILE, outputFile = OUTPUT_LOG_FILE) => {
  return readFileStream(inputFile).pipe(jsonFileWriteStream(outputFile))
}

module.exports = {
  readFileStream,
  jsonFileWriteStream,
  loadFile
}
