'use strict'

const EventEmitter = require('events').EventEmitter
const eventEmitter = new EventEmitter()

module.exports = {
  logEntry: require('./events/logEntryEvent')(eventEmitter)
}