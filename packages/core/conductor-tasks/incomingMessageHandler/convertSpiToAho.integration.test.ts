import "../../tests/helpers/setEnvironmentVariables"

import type { S3ClientConfig } from "@aws-sdk/client-s3"

import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import * as putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { randomUUID } from "crypto"
import fs from "fs"

import transformIncomingMessageToAho, {
  type TransformedOutput
} from "../../lib/parse/transformSpiToAho/transformIncomingMessageToAho"
import convertSpiToAho from "./convertSpiToAho"

const { INCOMING_BUCKET_NAME, TASK_DATA_BUCKET_NAME } = process.env
const s3Config = createS3Config()

const mockPutFileToS3 = putFileToS3 as { default: any }
const originalPutFileToS3 = mockPutFileToS3.default

const putFileToS3ReturnsException = () => new Error("Unexpected S3 Exception")

const putFileToS3Default = (body: string, fileName: string, bucket: string, config: S3ClientConfig) =>
  originalPutFileToS3(body, fileName, bucket, config)

describe("convertSpiToAho", () => {
  let correlationId: string
  let externalId: string
  let s3Path: string

  beforeEach(() => {
    mockPutFileToS3.default = putFileToS3Default
    externalId = randomUUID()
    correlationId = randomUUID()
    s3Path = `2023/08/31/14/48/${externalId}.xml`
  })

  it("should convert incoming messages to AHO, store in s3 and output an audit log", async () => {
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-001.xml"))
    await putFileToS3Default(inputMessage, s3Path, INCOMING_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path, correlationId } })

    const auditLogRecord = {
      caseId: "01ZD0303208",
      createdBy: "Incoming message handler",
      externalCorrelationId: "CID-test-001",
      externalId,
      isSanitised: 0,
      messageHash: "bb64ea8b30fa72e8b3c655c4208dccd06a12cd642f06147cf57d7d79c6253bc5",
      messageId: correlationId,
      receivedDate: new Date("2023-08-31T14:48:00.000Z"),
      s3Path,
      systemId: "B00LIBRA"
    }

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("auditLogRecord", auditLogRecord)
    expect(result.outputData).toHaveProperty("s3TaskDataPath")

    const { s3TaskDataPath } = result.outputData!
    const s3aho = JSON.parse(
      (await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config)) as string,
      dateReviver
    )
    const { aho } = transformIncomingMessageToAho(inputMessage) as TransformedOutput
    aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID = correlationId

    expect(JSON.stringify(s3aho)).toEqual(JSON.stringify(aho))
  })

  it("should extract the correlation ID from the message if the whole XML is invalid", async () => {
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-invalid-001.xml"))
    await putFileToS3Default(inputMessage, s3Path, INCOMING_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path, correlationId } })

    expect(result.status).toBe("COMPLETED")

    const auditLogRecord = {
      caseId: "UNKNOWN",
      createdBy: "Incoming message handler",
      externalCorrelationId: "CID-test-001",
      externalId,
      isSanitised: 0,
      messageHash: expect.any(String),
      messageId: correlationId,
      receivedDate: "2023-08-31T14:48:00.000Z",
      s3Path,
      systemId: "UNKNOWN"
    }

    expect(result.outputData).toHaveProperty("auditLogRecord", auditLogRecord)
  })

  it("should extract the correlation ID and PTIURN from the message if it fails to parse with zod", async () => {
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-invalid-002.xml"))
    await putFileToS3Default(inputMessage, s3Path, INCOMING_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path, correlationId } })

    expect(result.status).toBe("COMPLETED")

    const auditLogRecord = {
      caseId: "01ZD0303208",
      createdBy: "Incoming message handler",
      externalCorrelationId: "CID-test-001",
      externalId,
      isSanitised: 0,
      messageHash: expect.any(String),
      messageId: expect.any(String),
      receivedDate: "2023-08-31T14:48:00.000Z",
      s3Path,
      systemId: "B00LIBRA"
    }

    expect(result.outputData).toHaveProperty("auditLogRecord", auditLogRecord)
    expect(result.outputData).toHaveProperty("errorReportData", {
      errorMessage:
        'Validation error: Required at "ResultedCaseMessage.Session.Case.Defendant.Offence[2].BaseOffenceDetails.OffenceCode"',
      externalId,
      messageId: expect.any(String),
      ptiUrn: "01ZD0303208",
      receivedDate: "2023-08-31T14:48:00.000Z"
    })
  })

  it("should still create audit log record even if the file has no valid data in it", async () => {
    await putFileToS3Default("invalid", s3Path, INCOMING_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path, correlationId } })

    expect(result.status).toBe("COMPLETED")

    const auditLogRecord = {
      caseId: "UNKNOWN",
      createdBy: "Incoming message handler",
      externalCorrelationId: "UNKNOWN",
      externalId,
      isSanitised: 0,
      messageHash: expect.any(String),
      messageId: expect.any(String),
      receivedDate: "2023-08-31T14:48:00.000Z",
      s3Path,
      systemId: "UNKNOWN"
    }

    expect(result.outputData).toHaveProperty("auditLogRecord", auditLogRecord)
  })

  it("should fail with terminal error if the S3 path is missing", async () => {
    const result = await convertSpiToAho.execute({ inputData: { correlationId } })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("InputData error: Expected string for s3Path")
  })

  it("should fail if S3 path is incorrectly formatted", async () => {
    mockPutFileToS3.default = putFileToS3ReturnsException
    s3Path = `test_file_${externalId}.xml`
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-001.xml"))
    await putFileToS3Default(inputMessage, s3Path, INCOMING_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path, correlationId } })

    expect(result).toHaveProperty("status", "FAILED")
    expect(result.logs?.map((l) => l.log)).toContain("Failed to parse S3 path")
    expect(result.logs?.map((l) => l.log)).toContain(`The object key "${s3Path}" is in an invalid format`)
  })

  it("should fail if the correlationId is missing", async () => {
    mockPutFileToS3.default = putFileToS3ReturnsException
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-001.xml"))
    await putFileToS3Default(inputMessage, s3Path, INCOMING_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path } })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("InputData error: Expected string for correlationId")
  })

  it("should fail if it can't write to S3", async () => {
    mockPutFileToS3.default = putFileToS3ReturnsException
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-001.xml"))
    await putFileToS3Default(inputMessage, s3Path, INCOMING_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path, correlationId } })

    expect(result).toHaveProperty("status", "FAILED")
    expect(result.logs?.map((l) => l.log)).toContain("Could not put file to S3")
    expect(result.logs?.map((l) => l.log)).toContain("Unexpected S3 Exception")
  })
})
