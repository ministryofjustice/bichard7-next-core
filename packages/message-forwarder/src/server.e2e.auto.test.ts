import "./test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "auto"
const sourceQueue = "TEST_SOURCE_QUEUE"
process.env.SOURCE_QUEUE = sourceQueue
const destinationQueue = "TEST_DESTINATION_QUEUE"
process.env.DESTINATION = destinationQueue

import { startWorkflow } from "@moj-bichard7/common/conductor/conductorApi"
import createConductorConfig from "@moj-bichard7/common/conductor/createConductorConfig"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForHumanTask } from "@moj-bichard7/common/test/conductor/waitForHumanTask"
import MqListener from "@moj-bichard7/common/test/mq/listener"
import { uploadPncMock } from "@moj-bichard7/common/test/pnc/uploadPncMock"
import { putIncomingMessageToS3 } from "@moj-bichard7/common/test/s3/putIncomingMessageToS3"
import { randomUUID } from "crypto"
import fs from "fs"
import createStompClient from "./createStompClient"
import { messageForwarder } from "./messageForwarder"
import successExceptionsAHOFixture from "./test/fixtures/success-exceptions-aho.json"
import successExceptionsPNCMock from "./test/fixtures/success-exceptions-aho.pnc.json"

const client = createStompClient()
const mqConfig = createMqConfig()

const resubmittedAho = fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml").toString()
const conductorConfig = createConductorConfig()

describe("Server in auto mode", () => {
  let messageData: string
  let correlationId: string

  beforeAll(async () => {
    await messageForwarder(client)
  })

  afterAll(async () => {
    await client.deactivate()
  })

  beforeEach(() => {
    correlationId = randomUUID()
    messageData = resubmittedAho.replace("CORRELATION_ID", correlationId)
  })

  it("completes a human task if the workflow exists", async () => {
    const s3TaskDataPath = `${randomUUID()}.json`
    const successExceptionsAHO = JSON.stringify(successExceptionsAHOFixture).replace("CORRELATION_ID", correlationId)

    await createAuditLogRecord(correlationId)
    await putIncomingMessageToS3(successExceptionsAHO, s3TaskDataPath, correlationId)
    await uploadPncMock(successExceptionsPNCMock)

    await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    const task1 = await waitForHumanTask(correlationId, conductorConfig)
    expect(task1.iteration).toBe(1)

    await client.publish({ destination: sourceQueue, body: messageData })

    // if we complete the human task without fixing the AHO, it'll go round again
    const task2 = await waitForHumanTask(correlationId, conductorConfig, 2)
    expect(task2.iteration).toBe(2)
  })

  it("sends the message to the destination queue if no workflow exists", async () => {
    const mqListener = new MqListener(mqConfig)
    mqListener.listen(destinationQueue)
    await client.publish({ destination: sourceQueue, body: messageData })
    const message = await mqListener.waitForMessage()
    expect(message).toEqual(messageData)
    mqListener.stop()
  })

  it("puts the message on a failure queue if there is an exception", async () => {
    const mqListener = new MqListener(mqConfig)
    mqListener.listen(`${sourceQueue}.FAILURE`)
    await client.publish({ destination: sourceQueue, body: "BAD DATA" })
    const message = await mqListener.waitForMessage()
    expect(message).toBe("BAD DATA")
    mqListener.stop()
  })
})
