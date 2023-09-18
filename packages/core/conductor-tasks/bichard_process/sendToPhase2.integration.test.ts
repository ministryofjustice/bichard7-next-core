import "../../phase1/tests/helpers/setEnvironmentVariables"

import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import fs from "fs"
import { v4 as uuid } from "uuid"
import TestMqGateway from "../../lib/mq/TestMqGateway"
import createMqConfig from "../../lib/mq/createMqConfig"
import convertAhoToXml from "../../phase1/serialise/ahoXml/generate"
import { type Phase1SuccessResult } from "../../phase1/types/Phase1Result"
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
    const ahoS3Path = `${uuid()}.json`
    const s3Config = createS3Config()
    const phase1Result = String(
      fs.readFileSync("phase1/tests/fixtures/input-message-001-phase1-result-missing-result-type.json")
    )
    const parsedResult = JSON.parse(phase1Result, dateReviver) as Phase1SuccessResult
    await putFileToS3(phase1Result, ahoS3Path, taskDataBucket!, s3Config)
    const result = await sendToPhase2.execute({ inputData: { ahoS3Path } })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("auditLogEvents")
    expect(result.outputData?.auditLogEvents).toHaveLength(1)
    expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-2")

    const message = await testMqGateway.getMessage(queueName!)
    expect(message).toEqual(convertAhoToXml(parsedResult.hearingOutcome))
  })

  it("should fail if the aho S3 path hasn't been provided", async () => {
    const result = await sendToPhase2.execute({ inputData: {} })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("InputData error: Expected string for ahoS3Path")
  })

  it("should fail if there is a problem retrieving the file", async () => {
    const result = await sendToPhase2.execute({ inputData: { ahoS3Path: "unknown.json" } })

    expect(result.status).toBe("FAILED")
  })
})
