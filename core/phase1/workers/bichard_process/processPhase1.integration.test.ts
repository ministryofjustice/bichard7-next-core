import "core/phase1/tests/helpers/setEnvironmentVariables"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import createDbConfig from "common/database/createDbConfig"
import createS3Config from "common/s3/createS3Config"
import parseSpiResult from "core/phase1/parse/parseSpiResult"
import transformSpiToAho from "core/phase1/parse/transformSpiToAho"
import { test1PncResponse, test89PncResponse } from "core/phase1/tests/fixtures/mockPncApiResponses"
import MockS3 from "core/phase1/tests/helpers/MockS3"
import { Phase1ResultType } from "core/phase1/types/Phase1Result"
import fs from "fs"
import { MockServer } from "jest-mock-server"
import "jest-xml-matcher"
import postgres from "postgres"
import processPhase1 from "./processPhase1"

const bucket = "conductor-task-data"
const s3Config = createS3Config()
const dbConfig = createDbConfig()
const sql = postgres({
  ...dbConfig,
  types: {
    date: {
      to: 25,
      from: [1082],
      serialize: (x: string): string => x,
      parse: (x: string): Date => {
        return new Date(x)
      }
    }
  }
})

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

    process.env.TASK_DATA_BUCKET_NAME = bucket
  })

  afterAll(() => {
    s3Server.stop()
    client.destroy()
    pncApi.stop()
  })

  beforeEach(async () => {
    pncApi.reset()
    await sql`DELETE FROM br7own.error_list`
  })

  it("should write triggers to the database if they are raised", async () => {
    pncApi.get("/pnc/records/1101ZD0100000448754K").mockImplementationOnce((ctx) => {
      ctx.status = 200
      ctx.body = test1PncResponse
    })

    const inputMessage = String(fs.readFileSync("test-data/input-message-001.xml"))
    const inputSpi = parseSpiResult(inputMessage)
    const inputAho = transformSpiToAho(inputSpi)
    const inputAhoJson = JSON.stringify(inputAho)

    const ahoS3Path = "trigger.xml"
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: ahoS3Path,
      Body: inputAhoJson
    })

    await client.send(command)

    const result = await processPhase1.execute({ inputData: { ahoS3Path } })
    expect(result.outputData?.resultType).toEqual(Phase1ResultType.success)

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toHaveLength(3)
  })

  it("should write exceptions to the database if they are raised", async () => {
    pncApi.get("/pnc/records/1101ZD0100000410837W").mockImplementationOnce((ctx) => {
      ctx.status = 200
      ctx.body = test89PncResponse
    })

    const inputMessage = String(fs.readFileSync("test-data/input-message-089.xml"))
    const inputSpi = parseSpiResult(inputMessage)
    const inputAho = transformSpiToAho(inputSpi)
    const inputAhoJson = JSON.stringify(inputAho)

    const ahoS3Path = "exception.xml"
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: ahoS3Path,
      Body: inputAhoJson
    })
    await client.send(command)

    const result = await processPhase1.execute({ inputData: { ahoS3Path } })

    expect(result.outputData?.resultType).toEqual(Phase1ResultType.exceptions)

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)
    expect(errorListRecords[0].error_reason).toBe("HO100322")

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toHaveLength(0)
  })
})
