const queueName = (process.env.PHASE_2_QUEUE_NAME = "TEST_PHASE_2_QUEUE")
process.env.MQ_URL = "failover:(stomp://localhost:62613)"
process.env.MQ_USER = "admin"
process.env.MQ_PASSWORD = "admin"

import fs from "fs"
import { createMqConfig, TestMqGateway } from "src/lib/MqGateway"
import { parseAhoXml } from "src/parse/parseAhoXml"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import { Phase1ResultType } from "src/types/Phase1Result"
import sendToPhase2 from "./sendToPhase2"

const inputXml = fs.readFileSync("test-data/AnnotatedHO1.xml").toString()
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
    const result = await sendToPhase2(phase1Result)
    expect(result).toBe(phase1Result)

    const message = await testMqGateway.getMessage(queueName)
    expect(message).toEqual(convertAhoToXml(phase1Result.hearingOutcome))
  })

  it("should raise an exception if there is a problem", async () => {
    const phase1Result: Phase1SuccessResult = {
      correlationId: "dummy-id",
      auditLogEvents: [],
      triggers: [],
      hearingOutcome: {} as AnnotatedHearingOutcome,
      resultType: Phase1ResultType.success
    }

    let errorThrown = false
    try {
      await sendToPhase2(phase1Result)
    } catch (e) {
      errorThrown = true
    }
    expect(errorThrown).toBeTruthy()
  })
})
