'use strict'

const {logEntry} = require('../../../../src/domain/entity')

describe('Log entry domain', function () {
  it('Parses a given string to get a valid log entry', async () => {
    const row0 = logEntry.create(
      '202.32.50.6 [30:03:02:06] "GET /cgi-bin/waisgate?port=210&ip_address=earth1&database_name=/usr1/comwais/' +
      'indexes/HTDOCS&headline=Query Report for this Search&type=TEXT&docid=/usr1/comwais/indexes/HTDOCS0 0 ' +
      '/tmp/08300405.g3c HTTP/1.0" 200 169') // Border case (spaces in request)

    expect(row0).toMatchObject({
      "host": "202.32.50.6",
      "datetime": {
        "day": 30,
        "hour": 3,
        "minute": 2,
        "second": 6
      },
      "request": {
        "method": "GET",
        "url": "/cgi-bin/waisgate?port=210&ip_address=earth1&database_name=/usr1/comwais/indexes/HTDOCS&headline=" +
          "Query%20Report%20for%20this%20Search&type=TEXT&docid=%02%1C/usr1/comwais/indexes/HTDOCS%03%150%200%20" +
          "/tmp/08300405.g3c%07%01",
        "protocol": "HTTP",
        "protocol_version": "1.0"
      },
      "response_code": 200,
      "document_size": 169
    })
  })

  it('String with wrong format must be validated and not processed (must return false)', async () => {
    const row0 = logEntry.create('141.2[29:23:53:s] "GET /Software.html HTTP/1.0" 900 149s7nvm ')
    expect(row0).toBe(false)
  })

})