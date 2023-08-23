const queueName = (process.env.PHASE_2_QUEUE_NAME = "TEST_PHASE_2_QUEUE")
process.env.MQ_URL = "failover:(stomp://localhost:61613)"
process.env.MQ_USER = "admin"
process.env.MQ_PASSWORD = "admin"

import TestMqGateway from "@moj-bichard7/common/mq/TestMqGateway"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import fs from "fs"
import { parseAhoXml } from "phase1/parse/parseAhoXml"
import convertAhoToXml from "phase1/serialise/ahoXml/generate"
import type { Phase1SuccessResult } from "phase1/types/Phase1Result"
import { Phase1ResultType } from "phase1/types/Phase1Result"
import sendToPhase2 from "phase1/workers/phase1/sendToPhase2"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"

const inputXml = fs.readFileSync("phase1/tests/fixtures/AnnotatedHO1.xml").toString()
const hearingOutcome = parseAhoXml(inputXml) as AnnotatedHearingOutcome

const testMqGateway = new TestMqGateway(createMqConfig())

describe("sendToPhase2", () => {
  beforeEach(async () => {
    await testMqGateway.getMessages(queueName)
  })

  afterAll(async () => {
    await testMqGateway.dispose()
  })

  it("should send a message to the queue", async () => {
    const phase1Result: Phase1SuccessResult = {
      correlationId: "dummy-id",
      auditLogEvents: [],
      triggers: [],
      hearingOutcome,
      resultType: Phase1ResultType.success
    }
    const result = await sendToPhase2.execute({ inputData: { phase1Result: phase1Result } })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("auditLogEvents")
    expect(result.outputData?.auditLogEvents).toHaveLength(1)
    expect(result.outputData?.auditLogEvents[0].eventCode).toBe("hearing-outcome.submitted-phase-2")

    const message = await testMqGateway.getMessage(queueName)
    expect(message).toEqual(convertAhoToXml(phase1Result.hearingOutcome))
  })

  it("should return an error if there is a problem", async () => {
    const phase1Result: Phase1SuccessResult = {
      correlationId: "dummy-id",
      auditLogEvents: [],
      triggers: [],
      hearingOutcome: {} as AnnotatedHearingOutcome,
      resultType: Phase1ResultType.success
    }

    const result = await sendToPhase2.execute({ inputData: { phase1Result: phase1Result } })

    expect(result.status).toBe("FAILED")
  })
})
