'use strict'

const events = require('../../event').logEntry
const _ = require('lodash/fp')

const toNum = key => x => _.set(key, _.toNumber(x[key]), x)

const toDate = key => x => _.set(
  key,
  _.compose(
    xs => ({day: xs[0], hour: xs[1], minute: xs[2], second: xs[3]}),
    _.map(_.toNumber),
    _.split(':'),
    _.replace(']', ''),
    _.replace('[', '')
  )(x[key]),
  x
)

const logEntryFactory = _.compose(
  toDate('datetime'),
  toNum('document_size'),
  toNum('response_code'),
  xs => ({
    host: xs[0],
    datetime: xs[1],
    request: [xs[2], xs[3], xs[4]].join(' '),
    response_code: xs[5],
    document_size: xs[6]
  }),
  _.split(' ')
)

const isValidStr = x => x.match(/(.*) \[(\d+):(\d+):(\d+):(\d+)] "(GET|POST|PUT|DELETE|HEAD) (.*)" ([2345]\d\d) (\d+)/g)

const sanitize = _.replace(/-$/, '0') // Fixes size '-' (must be a number)

const create = x => _.cond([
  [_.compose(isValidStr, sanitize), _.compose(_.tap(events.emit.CREATED), logEntryFactory, sanitize)],
  [_.stubTrue, _.compose(_.tap(() => events.emit.ERRORED(x)), _.stubFalse)]
])(x)

module.exports = {
  create,
  events
}
