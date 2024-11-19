import "./test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "auto"
const sourceQueue = "TEST_SOURCE_QUEUE"
process.env.SOURCE_QUEUE = sourceQueue
const destinationQueue = "TEST_DESTINATION_QUEUE"
process.env.DESTINATION = destinationQueue

import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import waitForWorkflows from "@moj-bichard7/common/test/conductor/waitForWorkflows"
import MqListener from "@moj-bichard7/common/test/mq/listener"
import { uploadPncMock } from "@moj-bichard7/common/test/pnc/uploadPncMock"
import { putIncomingMessageToS3 } from "@moj-bichard7/common/test/s3/putIncomingMessageToS3"
import { randomUUID } from "crypto"
import fs from "fs"
import MessageForwarder from "./MessageForwarder"
import createStompClient from "./createStompClient"
import successExceptionsAHOFixture from "./test/fixtures/success-exceptions-aho.json"
import successExceptionsPNCMock from "./test/fixtures/success-exceptions-aho.pnc.json"

const stompClient = createStompClient()
const mqConfig = createMqConfig()
const conductorClient = createConductorClient()

const resubmittedAho = fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml").toString()

describe("Server in auto mode", () => {
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

  it("starts a new workflow if the correlation ID exists in Conductor", async () => {
    const s3TaskDataPath = `${randomUUID()}.json`
    const successExceptionsAHO = JSON.stringify(successExceptionsAHOFixture).replace("CORRELATION_ID", correlationId)

    await createAuditLogRecord(correlationId)
    await putIncomingMessageToS3(successExceptionsAHO, s3TaskDataPath, correlationId)
    await uploadPncMock(successExceptionsPNCMock)

    await conductorClient.workflowResource.startWorkflow1(
      "bichard_phase_1",
      { s3TaskDataPath },
      undefined,
      correlationId
    )

    let workflows = await waitForWorkflows({
      count: 1,
      query: { workflowType: "bichard_phase_1", status: "COMPLETED", correlationId }
    })
    expect(workflows).toHaveLength(1)

    await stompClient.publish({ destination: sourceQueue, body: messageData })

    workflows = await waitForWorkflows({
      count: 2,
      query: { workflowType: "bichard_phase_1", status: "COMPLETED", correlationId }
    })
    expect(workflows).toHaveLength(2)
  })

  it("sends the message to the destination queue if no workflow exists", async () => {
    const mqListener = new MqListener(mqConfig)
    mqListener.listen(destinationQueue)
    await stompClient.publish({ destination: sourceQueue, body: messageData })
    const message = await mqListener.waitForMessage()
    expect(message).toEqual(messageData)
    mqListener.stop()
  })

  it("puts the message on a failure queue if there is an exception", async () => {
    const mqListener = new MqListener(mqConfig)
    mqListener.listen(`${sourceQueue}.FAILURE`)
    await stompClient.publish({ destination: sourceQueue, body: "BAD DATA" })
    const message = await mqListener.waitForMessage()
    expect(message).toBe("BAD DATA")
    mqListener.stop()
  })
})
