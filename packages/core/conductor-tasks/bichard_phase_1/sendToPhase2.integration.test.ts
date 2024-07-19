import "../../phase1/tests/helpers/setEnvironmentVariables"

import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { randomUUID } from "crypto"
import fs from "fs"
import TestMqGateway from "../../lib/mq/TestMqGateway"
import createMqConfig from "../../lib/mq/createMqConfig"
import serialiseToXml from "../../lib/serialise/ahoXml/serialiseToXml"
import type Phase1Result from "../../phase1/types/Phase1Result"
import sendToPhase2 from "./sendToPhase2"

const queueName = process.env.PHASE_2_QUEUE_NAME
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME

const testMqGateway = new TestMqGateway(createMqConfig())

describe("sendToPhase2", () => {
  beforeEach(async () => {
    await testMqGateway.getMessages(queueName!)
  })

  afterAll(async () => {
    await testMqGateway.dispose()
  })

  it("should send a message to the queue", async () => {
    const s3TaskDataPath = `${randomUUID()}.json`
    const s3Config = createS3Config()
    const phase1Result = String(fs.readFileSync("phase1/tests/fixtures/input-message-001-phase1-result.json"))
    const parsedResult = JSON.parse(phase1Result, dateReviver) as Phase1Result
    await putFileToS3(phase1Result, s3TaskDataPath, taskDataBucket!, s3Config)
    const result = await sendToPhase2.execute({ inputData: { s3TaskDataPath } })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("auditLogEvents")
    expect(result.outputData?.auditLogEvents).toHaveLength(1)
    expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-2")

    const message = await testMqGateway.getMessage(queueName!)
    expect(message).toEqual(serialiseToXml(parsedResult.hearingOutcome))
  })

  it("should fail if the aho S3 path hasn't been provided", async () => {
    const result = await sendToPhase2.execute({ inputData: {} })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "Input data schema parse error: Expected string for s3TaskDataPath"
    )
  })

  it("should fail if there is a problem retrieving the file", async () => {
    const result = await sendToPhase2.execute({ inputData: { s3TaskDataPath: "unknown.json" } })

    expect(result.status).toBe("FAILED")
  })
})
