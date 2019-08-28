'use strict'

const {logEntry} = require('./domain/entity')
const {ERRORED, emitter} = logEntry.events

const {loadFile} = require('./infrastructure/persistence/fileDataSource')

loadFile() // Transforms stored log file to JSON format file

// Listeners
emitter.on(ERRORED, console.log) // TODO Any other action (like persist in other file) must be listen to this event
