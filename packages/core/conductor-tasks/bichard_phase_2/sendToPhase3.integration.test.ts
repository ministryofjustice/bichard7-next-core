import "../../phase1/tests/helpers/setEnvironmentVariables"

import { WorkflowResourceService } from "@io-orkes/conductor-javascript"
import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import { randomUUID } from "crypto"
import fs from "fs"

import type Phase2Result from "../../phase2/types/Phase2Result"

import connectAndSendMessage from "../../lib/mq/connectAndSendMessage"
import createMqConfig from "../../lib/mq/createMqConfig"
import TestMqGateway from "../../lib/mq/TestMqGateway"
import serialiseToXml from "../../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import { default as sendToPhase3Fn } from "./sendToPhase3"

jest.mock("../../lib/mq/connectAndSendMessage")
jest.mock("@moj-bichard7/common/s3/putFileToS3")
const mockedConnectAndSendMessage = connectAndSendMessage as jest.Mock
const mockedPutFileToS3 = putFileToS3 as jest.Mock

const queueName = process.env.PHASE_3_QUEUE_NAME
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME

const testMqGateway = new TestMqGateway(createMqConfig())
const s3Config = createS3Config()
const phase2ResultFixture = String(fs.readFileSync("phase2/tests/fixtures/input-message-001-phase2-result.json"))

const getPhase2Result = () => {
  const s3TaskDataPath = `${randomUUID()}.json`
  const correlationId = randomUUID()
  const phase2Result = phase2ResultFixture.replace(/EXTERNAL_CORRELATION_ID/g, correlationId)
  const parsedPhase2Result = JSON.parse(phase2Result, dateReviver) as Phase2Result

  return { phase2Result, parsedPhase2Result, s3TaskDataPath }
}

const sendToPhase3 = (canaryRatio: string | undefined, inputData: Record<string, unknown>) => {
  process.env.PHASE3_CORE_CANARY_RATIO = canaryRatio

  return sendToPhase3Fn.execute({ inputData })
}

describe("sendToPhase3", () => {
  beforeEach(async () => {
    mockedConnectAndSendMessage.mockImplementation(jest.requireActual("../../lib/mq/connectAndSendMessage").default)
    mockedPutFileToS3.mockImplementation(jest.requireActual("@moj-bichard7/common/s3/putFileToS3").default)
    await testMqGateway.getMessages(queueName!)
  })

  afterAll(async () => {
    await testMqGateway.dispose()
  })

  describe("when Phase 3 canary ratio is set to use MQ", () => {
    it.each(["0.0", undefined, "ABC"])(
      "should send a message to MQ when canary ratio is %s",
      async (phase3CoreCanaryRatio) => {
        const { phase2Result, parsedPhase2Result, s3TaskDataPath } = getPhase2Result()

        await putFileToS3(phase2Result, s3TaskDataPath, taskDataBucket!, s3Config)

        const result = await sendToPhase3(phase3CoreCanaryRatio, { s3TaskDataPath })

        expect(result.status).toBe("COMPLETED")
        expect(result.outputData).toHaveProperty("auditLogEvents")
        expect(result.outputData?.auditLogEvents).toHaveLength(1)
        expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-3")

        const message = await testMqGateway.getMessage(queueName!)
        expect(message).toEqual(serialiseToXml(parsedPhase2Result.outputMessage))
      }
    )

    it("should return failed status when it fails to send to MQ", async () => {
      mockedConnectAndSendMessage.mockRejectedValue(Error("Dummy MQ error"))
      const { phase2Result, s3TaskDataPath } = getPhase2Result()

      await putFileToS3(phase2Result, s3TaskDataPath, taskDataBucket!, s3Config)

      const result = await sendToPhase3(undefined, { s3TaskDataPath })

      expect(result.status).toBe("FAILED")
      expect(result.logs?.map((log) => log.log)).toEqual(["Failed to write to MQ", "Dummy MQ error"])
    })
  })

  describe("when Phase 3 Core canary ratio is set to use Conductor", () => {
    const phase3CoreCanaryRatio = "1.0"

    it("should start Phase 3 Conductor workflow", async () => {
      const { phase2Result, parsedPhase2Result, s3TaskDataPath } = getPhase2Result()

      await createAuditLogRecord(parsedPhase2Result.correlationId)
      await putFileToS3(phase2Result, s3TaskDataPath, taskDataBucket!, s3Config)

      const result = await sendToPhase3(phase3CoreCanaryRatio, { s3TaskDataPath })

      expect(result.status).toBe("COMPLETED")
      expect(result.outputData).toHaveProperty("auditLogEvents")
      expect(result.outputData?.auditLogEvents).toHaveLength(1)
      expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-3")

      const workflow = await waitForCompletedWorkflow(
        parsedPhase2Result.correlationId,
        "RUNNING",
        60_000,
        "bichard_phase_3"
      )
      expect(workflow).toBeDefined()
    })

    it("should return failed status when putFileToS3 returns error", async () => {
      const { phase2Result, parsedPhase2Result, s3TaskDataPath } = getPhase2Result()

      await createAuditLogRecord(parsedPhase2Result.correlationId)
      await putFileToS3(phase2Result, s3TaskDataPath, taskDataBucket!, s3Config)
      mockedPutFileToS3.mockResolvedValue(Error("Dummy S3 error"))

      const result = await sendToPhase3(phase3CoreCanaryRatio, { s3TaskDataPath })

      expect(result.status).toBe("FAILED")
      expect(result.logs?.map((log) => log.log)).toEqual(["Could not put file to S3", "Dummy S3 error"])
    })

    it("should return failed status when putFileToS3 rejects", async () => {
      const { phase2Result, parsedPhase2Result, s3TaskDataPath } = getPhase2Result()

      await createAuditLogRecord(parsedPhase2Result.correlationId)
      await putFileToS3(phase2Result, s3TaskDataPath, taskDataBucket!, s3Config)
      mockedPutFileToS3.mockRejectedValue(Error("Dummy S3 error"))

      const result = await sendToPhase3(phase3CoreCanaryRatio, { s3TaskDataPath })

      expect(result.status).toBe("FAILED")
      expect(result.logs?.map((log) => log.log)).toEqual(["Could not put file to S3", "Dummy S3 error"])
    })

    it("should return failed status when it fails to start the Conductor workflow", async () => {
      const spyStartWorkflow = jest
        .spyOn(WorkflowResourceService.prototype, "startWorkflow1")
        .mockRejectedValue(Error("Dummy Conductor error"))
      const { phase2Result, parsedPhase2Result, s3TaskDataPath } = getPhase2Result()

      await createAuditLogRecord(parsedPhase2Result.correlationId)
      await putFileToS3(phase2Result, s3TaskDataPath, taskDataBucket!, s3Config)

      const result = await sendToPhase3(phase3CoreCanaryRatio, { s3TaskDataPath })

      expect(result.status).toBe("FAILED")
      expect(result.logs?.map((log) => log.log)).toEqual([
        "Failed to start bichard_phase_3 workflow",
        "Dummy Conductor error"
      ])

      spyStartWorkflow.mockReset()
      jest.restoreAllMocks()
    })
  })

  describe("when Phase 3 canary ratio is set in the task input", () => {
    it("should start Phase 3 Conductor workflow when canary ratio in task input is -1", async () => {
      const phase3CoreCanaryRatioEnvVar = "1"
      const { phase2Result, parsedPhase2Result, s3TaskDataPath } = getPhase2Result()

      await createAuditLogRecord(parsedPhase2Result.correlationId)
      await putFileToS3(phase2Result, s3TaskDataPath, taskDataBucket!, s3Config)

      const result = await sendToPhase3(phase3CoreCanaryRatioEnvVar, {
        s3TaskDataPath,
        options: { phase3CanaryRatio: -1 }
      })

      expect(result.status).toBe("COMPLETED")
      expect(result.outputData).toHaveProperty("auditLogEvents")
      expect(result.outputData?.auditLogEvents).toHaveLength(1)
      expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-3")

      const workflow = await waitForCompletedWorkflow(
        parsedPhase2Result.correlationId,
        "RUNNING",
        60_000,
        "bichard_phase_3"
      )
      expect(workflow).toBeDefined()
    })

    it("should send a message to MQ when canary ratio in task input is -1", async () => {
      const phase3CoreCanaryRatioEnvVar = "0"
      const { phase2Result, parsedPhase2Result, s3TaskDataPath } = getPhase2Result()

      await putFileToS3(phase2Result, s3TaskDataPath, taskDataBucket!, s3Config)

      const result = await sendToPhase3(phase3CoreCanaryRatioEnvVar, {
        s3TaskDataPath,
        options: { phase3CanaryRatio: -1 }
      })

      expect(result.status).toBe("COMPLETED")
      expect(result.outputData).toHaveProperty("auditLogEvents")
      expect(result.outputData?.auditLogEvents).toHaveLength(1)
      expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-3")

      const message = await testMqGateway.getMessage(queueName!)
      expect(message).toEqual(serialiseToXml(parsedPhase2Result.outputMessage))
    })

    it("should override canary ratio env var and send a message to MQ", async () => {
      const phase3CoreCanaryRatioEnvVar = "1"
      const { phase2Result, parsedPhase2Result, s3TaskDataPath } = getPhase2Result()

      await putFileToS3(phase2Result, s3TaskDataPath, taskDataBucket!, s3Config)

      const result = await sendToPhase3(phase3CoreCanaryRatioEnvVar, {
        s3TaskDataPath,
        options: { phase3CanaryRatio: 0 }
      })

      expect(result.status).toBe("COMPLETED")
      expect(result.outputData).toHaveProperty("auditLogEvents")
      expect(result.outputData?.auditLogEvents).toHaveLength(1)
      expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-3")

      const message = await testMqGateway.getMessage(queueName!)
      expect(message).toEqual(serialiseToXml(parsedPhase2Result.outputMessage))
    })

    it("should override canary ratio env var and start Phase 3 Conductor workflow when canary ratio in task input is 1", async () => {
      const phase3CoreCanaryRatioEnvVar = "0"
      const { phase2Result, parsedPhase2Result, s3TaskDataPath } = getPhase2Result()

      await createAuditLogRecord(parsedPhase2Result.correlationId)
      await putFileToS3(phase2Result, s3TaskDataPath, taskDataBucket!, s3Config)

      const result = await sendToPhase3(phase3CoreCanaryRatioEnvVar, {
        s3TaskDataPath,
        options: { phase3CanaryRatio: 1 }
      })

      expect(result.status).toBe("COMPLETED")
      expect(result.outputData).toHaveProperty("auditLogEvents")
      expect(result.outputData?.auditLogEvents).toHaveLength(1)
      expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-3")

      const workflow = await waitForCompletedWorkflow(
        parsedPhase2Result.correlationId,
        "RUNNING",
        60_000,
        "bichard_phase_3"
      )
      expect(workflow).toBeDefined()
    })
  })

  it("should fail if the AHO S3 path hasn't been provided", async () => {
    const result = await sendToPhase3(undefined, {})

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "Input data schema parse error: Expected string for s3TaskDataPath"
    )
  })

  it("should fail if there is a problem retrieving the file", async () => {
    const result = await sendToPhase3(undefined, { s3TaskDataPath: "unknown.json" })

    expect(result.status).toBe("FAILED")
  })
})
