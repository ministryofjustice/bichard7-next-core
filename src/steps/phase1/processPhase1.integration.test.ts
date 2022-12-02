jest.setTimeout(9999999)
import "tests/helpers/setEnvironmentVariables"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"
import { MockServer } from "jest-mock-server"
import "jest-xml-matcher"
import MockDate from "mockdate"
import type { ImportedComparison } from "src/comparison/types/ImportedComparison"
import createS3Config from "src/lib/createS3Config"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import generateMockPncQueryResultFromAho from "tests/helpers/generateMockPncQueryResultFromAho"
import MockS3 from "tests/helpers/MockS3"
import processPhase1 from "./processPhase1"

const bucket = "phase-1-bucket"
const s3Config = createS3Config()

const extractAsnFromAhoXml = (ahoXml: string): string | void => {
  const matchResult = ahoXml.match(/<DC:ProsecutorReference>([^<]*)<\/DC:ProsecutorReference>/)
  if (matchResult) {
    return matchResult[1]
  }
}

const extractPncQueryDateFromAhoXml = (ahoXml: string): Date => {
  const matchResult = ahoXml.match(/<br7:PNCQueryDate>([^<]*)<\/br7:PNCQueryDate>/)
  if (matchResult) {
    return new Date(matchResult[1])
  }

  return new Date()
}

describe("processPhase1", () => {
  let s3Server: MockS3
  let client: S3Client
  let pncApi: MockServer

  beforeAll(async () => {
    s3Server = new MockS3(bucket)
    await s3Server.start()
    client = new S3Client(s3Config)

    pncApi = new MockServer({ port: 11000 })
    await pncApi.start()

    process.env.PHASE_1_BUCKET_NAME = bucket
  })

  afterAll(async () => {
    await s3Server.stop()
    await pncApi.stop()
  })

  it("should return failure if message XML cannot be parsed", async () => {
    const s3Path = "failure.xml"
    const command = new PutObjectCommand({ Bucket: bucket, Key: s3Path, Body: "invalid xml" })
    await client.send(command)

    const result = await processPhase1(s3Path)

    expect(result).toHaveProperty("failure", true)
    expect(result).toHaveProperty("auditLogEvents")
    expect(result.auditLogEvents).toHaveLength(3)
  })

  it("should correctly process an input message that doesn't raise any triggers or exceptions", async () => {
    const comparisonFile = fs.readFileSync("test-data/e2e-comparison/test-019.json")
    const comparison = JSON.parse(comparisonFile.toString()) as ImportedComparison
    const asn = extractAsnFromAhoXml(comparison.incomingMessage)
    const pncQueryDate = extractPncQueryDateFromAhoXml(comparison.annotatedHearingOutcome)
    MockDate.set(pncQueryDate)

    const s3Path = "no-triggers-exceptions.xml"
    const command = new PutObjectCommand({ Bucket: bucket, Key: s3Path, Body: comparison.incomingMessage })
    await client.send(command)

    pncApi.get(`/${asn}`).mockImplementationOnce((ctx) => {
      ctx.status = 200
      ctx.body = generateMockPncQueryResultFromAho(comparison.annotatedHearingOutcome)
    })

    const result = (await processPhase1(s3Path)) as Phase1SuccessResult
    expect(result).not.toHaveProperty("failure")
    expect(result.triggers).toStrictEqual(comparison.triggers)

    const resultXml = convertAhoToXml(result.hearingOutcome)
    expect(resultXml).toEqualXML(comparison.annotatedHearingOutcome)
  })
})
