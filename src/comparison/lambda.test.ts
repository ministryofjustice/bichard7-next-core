/* eslint-disable jest/no-conditional-expect */
const s3Port = 21001
const bucket = "comparison-bucket"
const region = (process.env.AWS_REGION = "local")
process.env.S3_REGION = region
const accessKeyId = (process.env.S3_AWS_ACCESS_KEY_ID = "S3RVER")
const secretAccessKey = (process.env.S3_AWS_SECRET_ACCESS_KEY = "S3RVER")
const endpoint = (process.env.S3_ENDPOINT = `http://localhost:${s3Port}`)

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"
import lambda from "src/comparison/lambda"
import MockS3 from "tests/helpers/mockS3"
import { ZodError } from "zod"

const uploadFile = async (fileName: string) => {
  const client = new S3Client({ region, endpoint, credentials: { accessKeyId, secretAccessKey }, forcePathStyle: true })
  const Body = await fs.promises.readFile(fileName)
  const command = new PutObjectCommand({ Bucket: bucket, Key: fileName, Body })
  return client.send(command)
}

describe("Comparison lambda", () => {
  let s3Server: MockS3

  beforeAll(async () => {
    s3Server = new MockS3(s3Port, bucket)
    await s3Server.start()
  })

  afterAll(async () => {
    await s3Server.stop()
  })

  beforeEach(async () => {
    await s3Server.reset()
  })

  it("should return a passing comparison result", async () => {
    const response = await uploadFile("test-data/comparison/passing.json")
    expect(response).toBeDefined()

    const result = await lambda({
      detail: { bucket: { name: bucket }, object: { key: "test-data/comparison/passing.json" } }
    })
    expect(result).toStrictEqual({
      triggersMatch: true,
      exceptionsMatch: true,
      xmlOutputMatches: true,
      xmlParsingMatches: true
    })
  })

  it("should return a failing comparison result", async () => {
    const response = await uploadFile("test-data/comparison/failing.json")
    expect(response).toBeDefined()
    const result = await lambda({
      detail: { bucket: { name: bucket }, object: { key: "test-data/comparison/failing.json" } }
    })
    expect(result).toStrictEqual({
      triggersMatch: false,
      exceptionsMatch: true,
      xmlOutputMatches: false,
      xmlParsingMatches: false
    })
  })

  it("should throw an error if the event did not match our schema", async () => {
    expect.assertions(2)
    try {
      await lambda({ wrongPath: "dummy" })
    } catch (e: unknown) {
      const error = e as Error
      expect(error).toBeInstanceOf(ZodError)
      expect((error as ZodError).issues[0].code).toBe("invalid_type")
    }
  })
})
