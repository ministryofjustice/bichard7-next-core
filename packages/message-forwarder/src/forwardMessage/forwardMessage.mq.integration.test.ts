import "../test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "mq"

import { randomUUID } from "crypto"
import fs from "fs"

import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import MqListener from "@moj-bichard7/common/test/mq/listener"

import createStompClient from "../createStompClient"
import forwardMessage from "./forwardMessage"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"

const mq = createMqConfig()
const stompClient = createStompClient()
const conductorClient = createConductorClient()

describe("forwardMessage", () => {
  let mqListener: MqListener
  let correlationId: string

  beforeAll(() => {
    mqListener = new MqListener(mq)
    mqListener.listen("TEST_HEARING_OUTCOME_INPUT_QUEUE")

    stompClient.activate()
  })

  beforeEach(async () => {
    correlationId = randomUUID()

    await createAuditLogRecord(correlationId)
  })

  afterEach(() => {
    jest.resetAllMocks()
    mqListener.clearMessages()
  })

  afterAll(async () => {
    mqListener.stop()
    await stompClient.deactivate()
  })

  it("sends the message to the resubmission queue if the destination type is MQ", async () => {
    const incomingMessage = String(fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml")).replace(
      "CORRELATION_ID",
      correlationId
    )
    await forwardMessage(incomingMessage, stompClient, conductorClient)
    const message = await mqListener.waitForMessage()

    expect(mqListener.messages).toHaveLength(1)
    expect(message).toMatch(correlationId)
  })
})
