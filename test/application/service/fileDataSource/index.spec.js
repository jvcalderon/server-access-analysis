'use strict'

const { importFromStoredFile } = require('../../../../src/application/service')

describe('Data importation from stored file', function () {
  it('Creates a read stream from stored file', async () => {
    const readStream = importFromStoredFile()
    const head = await new Promise(res => {
      readStream.on('data', res)
    })
    expect(head).toBe('141.243.1.172 [29:23:53:25] "GET /Software.html HTTP/1.0" 200 1497')
  })
})