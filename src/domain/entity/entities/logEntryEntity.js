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
    request: _.mapValues(_.replace('"', ''), {
      method: xs[2],
      url: xs[3],
      protocol: xs[4].split('/')[0],
      protocol_version: xs[4].split('/')[1],
    }),
    response_code: xs[5],
    document_size: xs[6]
  }),
  _.split(' ')
)

const isValidStr = x =>
  x.match(/(.*) \[(\d+):(\d+):(\d+):(\d+)] "(GET|POST|PUT|DELETE|HEAD|NO_METHOD) (.*)" ([2345]\d\d) (\d+)/g) &&
  _.compose(_.size, _.split(' '))(x) === 7

const getRequestArr = _.compose(
  _.split(' '),
  _.get('1'),
  _.split('"')
)

const encodeRequest = str => {
  return _.compose(
    x => _.replace(x, encodeURI(x), str),
    _.join(' '),
    _.compose(_.reverse, _.tail, _.reverse),
    _.tail,
    getRequestArr
  )(str)
}

const completeReqData = str => {
  return _.compose(
    x => _.replace(/"(.*)"/g, `"${x}"`, str),
    _.join(' '),
    xs => _.size(xs) === 2 ? ['NO_METHOD', ...xs] : xs,
    xs => _.includes(_.size(xs), [1, 2]) ? [...xs, 'NO_PROTOCOL/NO_VERSION'] : xs,
    getRequestArr
  )(str)
}

const sanitize = _.compose(
  completeReqData, // Fill gaps in request with fallback data
  encodeRequest, // Encodes url in request
  _.replace(/-$/, '0') // Fixes size '-' (must be a number)
)

const create = x => _.cond([
  [_.compose(isValidStr, sanitize), _.compose(_.tap(events.emit.CREATED), logEntryFactory, sanitize)],
  [_.stubTrue, _.compose(_.tap(() => events.emit.ERRORED(x)), _.stubFalse)]
])(x)

module.exports = {
  create,
  events
}
