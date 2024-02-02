import "./test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "conductor"
const sourceQueue = "TEST_SOURCE_QUEUE"
process.env.SOURCE_QUEUE = sourceQueue

import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import MqListener from "@moj-bichard7/common/test/mq/listener"
// import fs from "fs"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import { uploadPncMock } from "@moj-bichard7/common/test/pnc/uploadPncMock"
import { randomUUID } from "crypto"
import fs from "fs"
import createStompClient from "./createStompClient"
import { messageForwarder } from "./messageForwarder"
import successExceptionsPNCMock from "./test/fixtures/success-exceptions-aho.pnc.json"

const client = createStompClient()
const mqConfig = createMqConfig()

const resubmittedAho = fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml").toString()

describe("Server in conductor mode", () => {
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

  it("starts a new workflow", async () => {
    await createAuditLogRecord(correlationId)
    await uploadPncMock(successExceptionsPNCMock)

    await client.publish({ destination: sourceQueue, body: messageData })

    await waitForCompletedWorkflow(correlationId)
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
