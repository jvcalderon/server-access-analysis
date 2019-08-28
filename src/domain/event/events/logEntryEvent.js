'use strict'

const Emit = require('../utils').emit

const literals = {
  CREATED: 'log-entry:created',
  ERRORED: 'log-entry:errored'
}

module.exports = eventEmitter => {
  const emit = Emit(eventEmitter)
  return {
    ...literals,
    ...{
      emit: {
        CREATED: emit(literals.CREATED),
        ERRORED: emit(literals.ERRORED)
      },
      emitter: eventEmitter,
    }
  }
}