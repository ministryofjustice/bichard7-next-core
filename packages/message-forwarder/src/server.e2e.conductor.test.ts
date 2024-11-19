import "./test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "conductor"
const sourceQueue = "TEST_SOURCE_QUEUE"
process.env.SOURCE_QUEUE = sourceQueue

import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import MqListener from "@moj-bichard7/common/test/mq/listener"
import { uploadPncMock } from "@moj-bichard7/common/test/pnc/uploadPncMock"
import { randomUUID } from "crypto"
import fs from "fs"
import MessageForwarder from "./MessageForwarder"
import createStompClient from "./createStompClient"
import successExceptionsPNCMock from "./test/fixtures/success-exceptions-aho.pnc.json"

const stompClient = createStompClient()
const mqConfig = createMqConfig()
const conductorClient = createConductorClient()

const resubmittedAho = fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml").toString()

describe("Server in conductor mode", () => {
  let messageData: string
  let correlationId: string
  let messageForwarder: MessageForwarder

  beforeAll(async () => {
    messageForwarder = new MessageForwarder(stompClient, conductorClient)
    await messageForwarder.start()
  })

  afterAll(async () => {
    await messageForwarder.stop()
  })

  beforeEach(() => {
    correlationId = randomUUID()
    messageData = resubmittedAho.replace("CORRELATION_ID", correlationId)
  })

  it("starts a new workflow", async () => {
    await createAuditLogRecord(correlationId)
    await uploadPncMock(successExceptionsPNCMock)

    stompClient.publish({ destination: sourceQueue, body: messageData })

    const workflow = await waitForCompletedWorkflow(correlationId)
    expect(workflow).toBeDefined()
  })

  it("puts the message on a failure queue if there is an exception", async () => {
    const mqListener = new MqListener(mqConfig)
    mqListener.listen(`${sourceQueue}.FAILURE`)
    stompClient.publish({ destination: sourceQueue, body: "BAD DATA" })
    const message = await mqListener.waitForMessage()
    expect(message).toBe("BAD DATA")
    mqListener.stop()
  })
})
