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
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"

jest.setTimeout(50_000)

const queueName = process.env.PHASE_2_QUEUE_NAME
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME

const testMqGateway = new TestMqGateway(createMqConfig())
const s3Config = createS3Config()
const phase1ResultFixture = String(fs.readFileSync("phase1/tests/fixtures/input-message-001-phase1-result.json"))

const getPhase1Result = () => {
  const s3TaskDataPath = `${randomUUID()}.json`
  const correlationId = randomUUID()
  const phase1Result = phase1ResultFixture.replace(/EXTERNAL_CORRELATION_ID/g, correlationId)
  const parsedPhase1Result = JSON.parse(phase1Result, dateReviver) as Phase1Result

  return { phase1Result, parsedPhase1Result, s3TaskDataPath }
}

const sendToPhase2 = async (canaryRatio: string | undefined, inputData: Record<string, unknown>) => {
  process.env.PHASE2_CORE_CANARY_RATIO = canaryRatio

  const sendToPhase2Fn = (await import("./sendToPhase2")).default
  return sendToPhase2Fn.execute({ inputData })
}

describe("sendToPhase2", () => {
  beforeEach(async () => {
    jest.resetModules()
    await testMqGateway.getMessages(queueName!)
  })

  afterAll(async () => {
    await testMqGateway.dispose()
  })

  describe("when Phase 2 canary ratio is set to use MQ", () => {
    it.each(["0.0", undefined, "ABC"])(
      "should send a message to MQ when canary ratio is %s",
      async (phase2CoreCanaryRatio) => {
        const { phase1Result, parsedPhase1Result, s3TaskDataPath } = getPhase1Result()

        await putFileToS3(phase1Result, s3TaskDataPath, taskDataBucket!, s3Config)

        const result = await sendToPhase2(phase2CoreCanaryRatio, { s3TaskDataPath })

        expect(result.status).toBe("COMPLETED")
        expect(result.outputData).toHaveProperty("auditLogEvents")
        expect(result.outputData?.auditLogEvents).toHaveLength(1)
        expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-2")

        const message = await testMqGateway.getMessage(queueName!)
        expect(message).toEqual(serialiseToXml(parsedPhase1Result.hearingOutcome))
      }
    )
  })

  describe("when Phase 2 Core canary ratio is set to use Conductor", () => {
    const phase2CoreCanaryRatio = "1.0"

    it("should start Phase 2 Conductor workflow", async () => {
      const { phase1Result, parsedPhase1Result, s3TaskDataPath } = getPhase1Result()

      await createAuditLogRecord(parsedPhase1Result.correlationId)
      await putFileToS3(phase1Result, s3TaskDataPath, taskDataBucket!, s3Config)

      const result = await sendToPhase2(phase2CoreCanaryRatio, { s3TaskDataPath })

      expect(result.status).toBe("COMPLETED")
      expect(result.outputData).toHaveProperty("auditLogEvents")
      expect(result.outputData?.auditLogEvents).toHaveLength(1)
      expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-2")

      const workflow = await waitForCompletedWorkflow(
        parsedPhase1Result.correlationId,
        "COMPLETED",
        60_000,
        "bichard_phase_2"
      )
      expect(workflow).toBeDefined()
    })
  })

  it("should fail if the AHO S3 path hasn't been provided", async () => {
    const result = await sendToPhase2(undefined, {})

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "Input data schema parse error: Expected string for s3TaskDataPath"
    )
  })

  it("should fail if there is a problem retrieving the file", async () => {
    const result = await sendToPhase2(undefined, { s3TaskDataPath: "unknown.json" })

    expect(result.status).toBe("FAILED")
  })
})
