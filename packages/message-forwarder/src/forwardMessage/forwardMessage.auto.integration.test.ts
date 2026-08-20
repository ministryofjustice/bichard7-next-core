import "../test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "auto" // has to be done prior to module imports
process.env.CONDUCTOR_WORKFLOW = "bichard_phase_1"

import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import MqListener from "@moj-bichard7/common/test/mq/listener"
import { uploadPncMock } from "@moj-bichard7/common/test/pnc/uploadPncMock"
import { putIncomingMessageToS3 } from "@moj-bichard7/common/test/s3/putIncomingMessageToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import fs from "fs"
import postgres from "postgres"
import createStompClient from "../createStompClient"
import successExceptionsAHOFixture from "../test/fixtures/success-exceptions-aho.json"
import successExceptionsPNCMock from "../test/fixtures/success-exceptions-aho.pnc.json"
import { clearTables, insertCase } from "../test/setup/database"
import forwardMessage from "./forwardMessage"
import { WorkflowExecutor } from "@io-orkes/conductor-javascript"

const mq = createMqConfig()
const stompClient = createStompClient()
const database = postgres(createDbConfig(true))
const testDatabase = postgres(createDbConfig())

describe("forwardMessage", () => {
  let mqListener: MqListener
  let correlationId: string
  let s3TaskDataPath: string

  let successExceptionsAHO: string

  beforeAll(() => {
    mqListener = new MqListener(mq)
    mqListener.listen("TEST_HEARING_OUTCOME_INPUT_QUEUE")

    stompClient.activate()
  })

  beforeEach(async () => {
    mqListener.clearMessages()

    correlationId = randomUUID()
    s3TaskDataPath = `${correlationId}.json`

    successExceptionsAHO = JSON.stringify(successExceptionsAHOFixture).replace("CORRELATION_ID", correlationId)

    await createAuditLogRecord(correlationId)
    await clearTables(testDatabase)
  })

  afterEach(() => {
    jest.resetAllMocks()
    mqListener.clearMessages()
  })

  afterAll(async () => {
    mqListener.stop()
    await stompClient.deactivate()
    await database.end()
    await testDatabase.end()
  })

  it("sends the message to the resubmission queue if the destination type is auto and no conductor workflow exists", async () => {
    const incomingMessage = String(fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml")).replace(
      "CORRELATION_ID",
      correlationId
    )
    const conductorClient = await createConductorClient()

    await forwardMessage(incomingMessage, stompClient, conductorClient, database)
    const message = await mqListener.waitForMessage()

    expect(mqListener.messages).toHaveLength(1)
    expect(message).toMatch(correlationId)
  })

  it("starts another workflow if the correlation ID already exists", async () => {
    await putIncomingMessageToS3(successExceptionsAHO, s3TaskDataPath, correlationId)
    await uploadPncMock(successExceptionsPNCMock)

    const conductorClient = await createConductorClient()
    const executor = new WorkflowExecutor(conductorClient)

    const startWorkflowResult = await executor
      .startWorkflow({
        name: "bichard_phase_1",
        input: { s3TaskDataPath },
        correlationId
      })
      .catch((e) => e as Error)
    expect(isError(startWorkflowResult)).toBeFalsy()

    let workflows = await executor.search(
      0,
      10,
      `workflowType = 'bichard_phase_1' AND correlationId = '${correlationId}'`,
      "*"
    )
    expect(workflows).toHaveLength(1)

    const resubmittedMessage = String(
      fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml")
    ).replace("CORRELATION_ID", correlationId)
    await insertCase(testDatabase, { message_id: correlationId })

    await forwardMessage(resubmittedMessage, stompClient, conductorClient, database)

    workflows = await executor.search(
      0,
      10,
      `workflowType = 'bichard_phase_1' AND correlationId = '${correlationId}'`,
      "*"
    )
    expect(workflows).toHaveLength(2)
  })
})
