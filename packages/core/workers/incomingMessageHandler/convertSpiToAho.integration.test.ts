jest.setTimeout(9999999)

import "../../phase1/tests/helpers/setEnvironmentVariables"

import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import fs from "fs"
import { v4 as uuid } from "uuid"
import convertSpiToAho from "./convertSpiToAho"

const incomingBucket = "phase1"
// const outgoingBucket = "conductor-task-data"
const s3Config = createS3Config()

describe("convertSpiToAho", () => {
  it("should do something", async () => {
    const externalId = uuid()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`
    const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-001.xml"))
    await putFileToS3(inputMessage, s3Path, incomingBucket, s3Config)

    const result = await convertSpiToAho.execute({ inputData: { s3Path } })

    const auditLogRecord = {
      caseId: "01ZD0303208",
      createdBy: "Incoming message handler",
      externalCorrelationId: "CID-test-001",
      externalId,
      isSanitised: 0,
      messageHash: "bb64ea8b30fa72e8b3c655c4208dccd06a12cd642f06147cf57d7d79c6253bc5",
      messageId: "17905858-592a-4272-a55e-d544766ab2b5",
      receivedDate: new Date("2023-08-31T13:48:00.000Z"),
      s3Path,
      systemId: "B00LIBRA"
    }

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("auditLogRecord", auditLogRecord)
  })
})
