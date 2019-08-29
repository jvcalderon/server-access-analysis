'use strict'

const fs = require('fs')

const {
  readFileStream,
  jsonFileWriteStream,
  loadFile
} = require('../../../../src/infrastructure/persistence/fileDataSource')
const INPUT_FILE = `${__dirname}/resources/epa-http.txt`
const OUTPUT_FILE = `${__dirname}/resources/epa-http.json`

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
    writeStream.write(`{"name":"Ambrosio","surname":"Casildo"}`)
    writeStream.end('')

    const result = await new Promise(res => {
      return writeStream.on('finish', () => res(fs.readFileSync(OUTPUT_FILE).toString()))
    })

    expect(fs.existsSync(OUTPUT_FILE)).toBe(true)
    expect(result).toBe(
      '[\n' +
      '{"name":"Pedro","surname":"Romaguera","date":"1901-02-01T01:01:00.000Z"}\n' +
      '{"name":"Ambrosio","surname":"Casildo"}\n' +
      ']\n'
    )
  })

  it('Creates a read stream and transform data from stored file', async () => {
    const readStream = readFileStream(INPUT_FILE)
    let content = ''
    await new Promise(res => {
      readStream
        .on('data', x => content += x)
        .on('end', () => res(content))
    })
    expect(content).toBe('{"host":"141.243.1.172","datetime":{"day":29,"hour":23,"minute":53,"second":25},' +
      '"request":"\\"GET /Software.html HTTP/1.0\\"","response_code":200,"document_size":1497},\n' +
      '{"host":"query2.lycos.cs.cmu.edu","datetime":{"day":29,"hour":23,"minute":53,"second":36},"request":"\\"GET ' +
      '/Consumer.html HTTP/1.0\\"","response_code":200,"document_size":1325}')
  })

  it('Transforms logs in txt from given file to new JSON file', async () => {
    const stream = loadFile(INPUT_FILE, OUTPUT_FILE)
    const result = await new Promise(res => {
      return stream.on('finish', () => res(fs.readFileSync(OUTPUT_FILE).toString()))
    })
    expect(result).toBe('[\n' +
      '{"host":"141.243.1.172","datetime":{"day":29,"hour":23,"minute":53,"second":25},"request":"\\"GET ' +
      '/Software.html HTTP/1.0\\"","response_code":200,"document_size":1497},\n' +
      '{"host":"query2.lycos.cs.cmu.edu","datetime":{"day":29,"hour":23,"minute":53,"second":36},"request":"\\"GET ' +
      '/Consumer.html HTTP/1.0\\"","response_code":200,"document_size":1325}' +
      '\n]\n')
  })
})