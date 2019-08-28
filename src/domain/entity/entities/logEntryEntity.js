'use strict'

const events = require('../../event').logEntry
const _ = require('lodash/fp')

const toNum = key => x => _.set(key, _.toNumber(x[key]), x)

const toDate = key => x => _.set(
  key,
  _.compose(
    xs => new Date(2019, 7, ...xs), // TODO: Hardcoded year and month. It's just valid for the specific exercise purpose
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

const isValidStr = x => x.match(/(.*) \[(\d+):(\d+):(\d+):(\d+)] "(GET|POST|PUT|DELETE) (.*)" ([2345]\d\d) (\d+)/g)

const create = _.cond([
  [isValidStr, _.compose(_.tap(events.emit.CREATED), logEntryFactory)],
  [_.stubTrue, _.compose(_.tap(events.emit.ERRORED), _.stubFalse)]
])

module.exports = {
  create,
  events
}
