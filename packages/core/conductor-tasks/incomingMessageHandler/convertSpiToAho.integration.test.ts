import "../../phase1/tests/helpers/setEnvironmentVariables"

import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import fs from "fs"
import { v4 as uuid } from "uuid"
import transformIncomingMessageToAho, {
  type TransformedOutput
} from "../../phase1/parse/transformSpiToAho/transformIncomingMessageToAho"
import convertSpiToAho from "./convertSpiToAho"

const { PHASE1_BUCKET_NAME, TASK_DATA_BUCKET_NAME } = process.env
const s3Config = createS3Config()

describe("convertSpiToAho", () => {
  it("should convert incoming messages to AHO, store in s3 and output an audit log", async () => {
    const externalId = uuid()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-001.xml"))
    await putFileToS3(inputMessage, s3Path, PHASE1_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path } })

    const auditLogRecord = {
      caseId: "01ZD0303208",
      createdBy: "Incoming message handler",
      externalCorrelationId: "CID-test-001",
      externalId,
      isSanitised: 0,
      messageHash: "bb64ea8b30fa72e8b3c655c4208dccd06a12cd642f06147cf57d7d79c6253bc5",
      messageId: expect.any(String),
      receivedDate: new Date("2023-08-31T14:48:00.000Z"),
      s3Path,
      systemId: "B00LIBRA"
    }

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("auditLogRecord", auditLogRecord)
    expect(result.outputData).toHaveProperty("s3TaskDataPath")
    expect(result.outputData).toHaveProperty("correlationId")

    const { s3TaskDataPath } = result.outputData!
    const s3aho = JSON.parse(
      (await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config)) as string,
      dateReviver
    )
    const { aho } = transformIncomingMessageToAho(inputMessage) as TransformedOutput
    aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID = result.outputData!.correlationId

    expect(JSON.stringify(s3aho)).toEqual(JSON.stringify(aho))
  })

  it("should extract the correlation ID from the message if the whole XML is invalid", async () => {
    const externalId = uuid()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-invalid-001.xml"))
    await putFileToS3(inputMessage, s3Path, PHASE1_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path } })

    expect(result.status).toBe("COMPLETED")

    const auditLogRecord = {
      caseId: "UNKNOWN",
      createdBy: "Incoming message handler",
      externalCorrelationId: "CID-test-001",
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

  it("should extract the correlation ID and PTIURN from the message if it fails to parse with zod", async () => {
    const externalId = uuid()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-invalid-002.xml"))
    await putFileToS3(inputMessage, s3Path, PHASE1_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path } })

    expect(result.status).toBe("COMPLETED")

    const auditLogRecord = {
      caseId: "UNKNOWN",
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
  })

  it("should stillp something even if the file has no valid data in it", async () => {
    const externalId = uuid()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`
    await putFileToS3("invalid", s3Path, PHASE1_BUCKET_NAME!, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path } })

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
    const result = await convertSpiToAho.execute({ inputData: {} })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("InputData error: Expected string for s3Path")
  })
})
