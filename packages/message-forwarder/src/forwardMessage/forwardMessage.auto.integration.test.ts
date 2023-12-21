import "../test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "auto" // has to be done prior to module imports

import { startWorkflow } from "@moj-bichard7/common/conductor/conductorApi"
import createConductorConfig from "@moj-bichard7/common/conductor/createConductorConfig"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForHumanTask } from "@moj-bichard7/common/test/conductor/waitForHumanTask"
import MqListener from "@moj-bichard7/common/test/mq/listener"
import { uploadPncMock } from "@moj-bichard7/common/test/pnc/uploadPncMock"
import { putIncomingMessageToS3 } from "@moj-bichard7/common/test/s3/putIncomingMessageToS3"
import { Client } from "@stomp/stompjs"
import { randomUUID } from "crypto"
import fs from "fs"
import createStompClient from "../createStompClient"
import successExceptionsAHOFixture from "../test/fixtures/success-exceptions-aho.json"
import successExceptionsPNCMock from "../test/fixtures/success-exceptions-aho.pnc.json"
import forwardMessage from "./forwardMessage"

const mq = createMqConfig()
const stomp = createStompClient()
const conductorConfig = createConductorConfig()

describe("forwardMessage", () => {
  let mqListener: MqListener
  let correlationId: string
  let s3TaskDataPath: string

  let successExceptionsAHO: string

  beforeAll(() => {
    mqListener = new MqListener(mq)
    mqListener.listen("TEST_HEARING_OUTCOME_INPUT_QUEUE")

    stomp.activate()
  })

  beforeEach(async () => {
    mqListener.clearMessages()

    correlationId = randomUUID()
    s3TaskDataPath = `${correlationId}.json`

    successExceptionsAHO = JSON.stringify(successExceptionsAHOFixture).replace("CORRELATION_ID", correlationId)

    await createAuditLogRecord(correlationId)
  })

  afterEach(() => {
    jest.resetAllMocks()
    mqListener.clearMessages()
  })

  afterAll(async () => {
    mqListener.stop()
    await stomp.deactivate()
  })

  it("sends the message to the resubmission queue if the destination type is auto and no conductor workflow exists", async () => {
    const incomingMessage = String(fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml")).replace(
      "CORRELATION_ID",
      correlationId
    )
    await forwardMessage(incomingMessage, stomp)
    const message = await mqListener.waitForMessage()

    expect(mqListener.messages).toHaveLength(1)
    expect(message).toMatch(correlationId)
  })

  it("completes the human task if the workflow already exists", async () => {
    await putIncomingMessageToS3(successExceptionsAHO, s3TaskDataPath, correlationId)
    await uploadPncMock(successExceptionsPNCMock)

    await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    const task1 = await waitForHumanTask(correlationId, conductorConfig)
    expect(task1.iteration).toBe(1)

    const resubmittedMessage = String(
      fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml")
    ).replace("CORRELATION_ID", correlationId)

    await forwardMessage(resubmittedMessage, expect.any(Client))

    // if we complete the human task without fixing the AHO, it'll go round again
    const task2 = await waitForHumanTask(correlationId, conductorConfig)
    expect(task2.iteration).toBe(2)
  })
})
