'use strict'

const fs = require('fs')

const {readStoredFileStream, jsonFileWriteStream} = require('../../../../src/infrastructure/persistence/fileDataSource')
const OUTPUT_FILE = `${__dirname}/epa-http.json`

const rmFile = () => {
  if (fs.existsSync(OUTPUT_FILE)) {
    fs.unlinkSync(OUTPUT_FILE)
  }
}

describe('Data importation from stored file', function () {
  beforeEach(rmFile)
  afterAll(rmFile)

  it('Given object should be appended in a specific JSON file by using a write stream', async () => {
    const writeStream = jsonFileWriteStream(OUTPUT_FILE)
    writeStream.write(`{"name":"Pedro","surname":"Romaguera","date":"1901-02-01T01:01:00.000Z"}\n`)
    writeStream.write(`{"name":"Ambrosio","surname":"Casildo"}\n`)
    writeStream.end('')

    const result = await new Promise(res => {
      return writeStream.on('finish', () => res(fs.readFileSync(OUTPUT_FILE).toString()))
    })

    expect(fs.existsSync(OUTPUT_FILE)).toBe(true)
    expect(result).toBe(
      '{"name":"Pedro","surname":"Romaguera","date":"1901-02-01T01:01:00.000Z"}\n' +
      '{"name":"Ambrosio","surname":"Casildo"}\n'
    )
  })

  it('Creates a read stream and transform data from stored file', async () => {
    const readStream = readStoredFileStream()
    const head = await new Promise(res => {
      readStream.on('data', res)
    })
    expect(head).toEqual({
      "host": "141.243.1.172",
      "datetime": new Date('2019-08-29T21:53:25.000Z'),
      "request": "\"GET /Software.html HTTP/1.0\"",
      "response_code": 200,
      "document_size": 1497
    })
  })
})