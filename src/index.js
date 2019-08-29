'use strict'

const {logEntry} = require('./domain/entity')
const {ERRORED, emitter} = logEntry.events

const {loadFile} = require('./infrastructure/persistence/fileDataSource')
const load = async () => await new Promise(res => loadFile().on('finish', res))

// Launch UI after transform stored log file to JSON format file
load().then(() => require('./infrastructure/http'))

// Listeners
emitter.on(ERRORED, console.log) // TODO Any other action (like persist in other file) must be listen to this event
