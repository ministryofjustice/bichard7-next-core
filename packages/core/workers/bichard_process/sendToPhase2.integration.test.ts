jest.setTimeout(999999999)
import "../../phase1/tests/helpers/setEnvironmentVariables"

import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import fs from "fs"
import { v4 as uuid } from "uuid"
import TestMqGateway from "../../lib/mq/TestMqGateway"
import createMqConfig from "../../lib/mq/createMqConfig"
import { parseAhoXml } from "../../phase1/parse/parseAhoXml"
import convertAhoToXml from "../../phase1/serialise/ahoXml/generate"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import sendToPhase2 from "./sendToPhase2"

const queueName = process.env.PHASE_2_QUEUE_NAME
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME

const inputXml = fs.readFileSync("phase1/tests/fixtures/AnnotatedHO1.xml").toString()
const hearingOutcome = parseAhoXml(inputXml) as AnnotatedHearingOutcome

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
    await putFileToS3(JSON.stringify(hearingOutcome), ahoS3Path, taskDataBucket!, s3Config)
    const result = await sendToPhase2.execute({ inputData: { ahoS3Path } })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("auditLogEvents")
    expect(result.outputData?.auditLogEvents).toHaveLength(1)
    expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-2")

    const message = await testMqGateway.getMessage(queueName!)
    expect(message).toEqual(convertAhoToXml(hearingOutcome))
  })

  it("should fail if the aho S3 path hasn't been provided", async () => {
    const result = await sendToPhase2.execute({ inputData: {} })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
  })

  it("should fail if there is a problem retrieving the file", async () => {
    const result = await sendToPhase2.execute({ inputData: { ahoS3Path: "unknown.json" } })

    expect(result.status).toBe("FAILED")
  })
})
