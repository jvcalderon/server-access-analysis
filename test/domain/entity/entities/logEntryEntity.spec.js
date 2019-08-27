'use strict'

const { logEntry } = require('../../../../src/domain/entity')

describe('Log entry domain', function () {
  it('Parses a given string to get a valid log entry', async () => {
    const row0 = logEntry.create('141.243.1.172 [29:23:53:25] "GET /Software.html HTTP/1.0" 200 1497')
    expect(row0).toMatchObject({
      "host": "141.243.1.172",
      "datetime": new Date("2019-08-29T21:53:25.000Z"),
      "request": "\"GET /Software.html HTTP/1.0\"",
      "response_code": 200,
      "document_size": 1497
    })
  })
})