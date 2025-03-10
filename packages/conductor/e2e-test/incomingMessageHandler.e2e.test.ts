process.env.S3_ENDPOINT = "http://localhost:4566"
process.env.S3_AWS_ACCESS_KEY_ID = "test"
process.env.S3_AWS_SECRET_ACCESS_KEY = "test"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import waitForWorkflows from "@moj-bichard7/common/test/conductor/waitForWorkflows"
import { type AuditLogApiRecordOutput } from "@moj-bichard7/common/types/AuditLogRecord"
import AuditLogStatus from "@moj-bichard7/common/types/AuditLogStatus"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { randomUUID } from "crypto"
import fs from "fs"
import mailhogClient from "mailhog"

const mailhog = mailhogClient()

const INCOMING_BUCKET_NAME = "incoming-messages"
const s3Config = createS3Config()

describe("Incoming message handler", () => {
  beforeEach(() => {
    mailhog.deleteAll()
  })

  it("records parsing failures as audit log events and messages common platform", async () => {
    // start the workflow
    const externalId = randomUUID()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`

    const externalCorrelationId = randomUUID()
    const inputMessage = String(fs.readFileSync("e2e-test/fixtures/invalid-input-message.xml")).replace(
      "EXTERNAL_CORRELATION_ID",
      externalCorrelationId
    )

    await putFileToS3(inputMessage, s3Path, INCOMING_BUCKET_NAME!, s3Config)

    // search for the workflow
    const workflows = await waitForWorkflows({
      freeText: s3Path,
      query: {
        status: "COMPLETED",
        workflowType: "incoming_message_handler"
      }
    })
    expect(workflows).toHaveLength(1)

    // expect audit log and audit log event
    const apiClient = new AuditLogApiClient("http://localhost:7010", "test")
    const messages = await apiClient.getAuditLogs({
      externalCorrelationId
    })
    expect(messages).toHaveLength(1)

    const [message] = messages as AuditLogApiRecordOutput[]
    expect(message.events).toHaveLength(1)
    expect(message.events[0]).toHaveProperty("eventCode", EventCode.MessageRejected)
    expect(message).toHaveProperty("externalId", externalId)
    expect(message).toHaveProperty("caseId", "01ZD0303208")

    const allMail = await mailhog.messages()
    expect(allMail).not.toBeNull()
    expect(allMail).toHaveProperty("count", 1)

    const mail = allMail?.items[0]
    expect(mail).toHaveProperty("from", "no-reply@mail.bichard7.service.justice.gov.uk")
    expect(mail?.subject).toMatch("Failed to ingest SPI message, schema mismatch")
    expect(mail?.text).toMatch("Received date: 2023-08-31T14:48:00.000Z")
    expect(mail?.text).toMatch(`Bichard internal message ID: ${message.messageId}`)
    expect(mail?.text).toMatch(`Common Platform ID: ${externalId}`)
    expect(mail?.text).toMatch(`PTIURN: ${message.caseId}`)
  })

  it("terminates the incoming message handler when a duplicate message is received", async () => {
    const externalId = randomUUID()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`

    const externalCorrelationId = randomUUID()
    let inputMessage = String(fs.readFileSync("e2e-test/fixtures/input-message-001.xml"))
      .replace("EXTERNAL_CORRELATION_ID", externalCorrelationId)
      .replace("UNIQUE_HASH", randomUUID())
    await putFileToS3(inputMessage, s3Path, INCOMING_BUCKET_NAME!, s3Config)

    // search for the workflow
    const workflows = await waitForWorkflows({
      freeText: s3Path,
      query: {
        status: "COMPLETED",
        workflowType: "incoming_message_handler"
      }
    })
    expect(workflows).toHaveLength(1)

    const duplicateCorrelationId = randomUUID()
    const duplicateExternalId = randomUUID()
    inputMessage = String(inputMessage.replace(externalCorrelationId, duplicateCorrelationId))
    const duplicateMessageS3Path = `2023/08/31/14/49/${duplicateExternalId}.xml`
    await putFileToS3(inputMessage, duplicateMessageS3Path, INCOMING_BUCKET_NAME!, s3Config)

    // search for the workflow
    const duplicateWorkflows = await waitForWorkflows({
      freeText: duplicateMessageS3Path,
      query: {
        status: "COMPLETED",
        workflowType: "incoming_message_handler"
      }
    })
    expect(duplicateWorkflows).toHaveLength(1)
    expect(duplicateWorkflows[0]?.reasonForIncompletion).toMatch(/Workflow is COMPLETED by TERMINATE task/)

    // expect audit log and audit log event
    const apiClient = new AuditLogApiClient("http://localhost:7010", "test")
    const originalMessages = await apiClient.getAuditLogs({
      externalCorrelationId
    })
    const duplicateMessages = await apiClient.getAuditLogs({
      externalCorrelationId: duplicateCorrelationId
    })
    expect(originalMessages).toHaveLength(1)
    expect(duplicateMessages).toHaveLength(1)

    const [originalMessage] = originalMessages as AuditLogApiRecordOutput[]
    const [duplicateMessage] = duplicateMessages as AuditLogApiRecordOutput[]
    expect(originalMessage.messageHash).toBe(duplicateMessage.messageHash)
    expect(duplicateMessage.status).toBe(AuditLogStatus.Duplicate)
  })

  it("terminates the incoming message handler when message has already been processed", async () => {
    const externalId = randomUUID()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`

    const externalCorrelationId = randomUUID()
    const inputMessage = String(fs.readFileSync("e2e-test/fixtures/input-message-001.xml"))
      .replace("EXTERNAL_CORRELATION_ID", externalCorrelationId)
      .replace("UNIQUE_HASH", randomUUID())
    await putFileToS3(inputMessage, s3Path, INCOMING_BUCKET_NAME!, s3Config)

    // search for the workflow
    const workflows = await waitForWorkflows({
      freeText: s3Path,
      query: {
        status: "COMPLETED",
        workflowType: "incoming_message_handler"
      }
    })
    expect(workflows).toHaveLength(1)
    const correlationId = workflows[0].correlationId

    // Start workflow again with the same correlation ID
    const conductorClient = createConductorClient()
    const newWorkflowId = await conductorClient.workflowResource.startWorkflow({
      correlationId,
      input: { s3Path },
      name: "incoming_message_handler"
    })

    // search for the incoming_message_handler workflows
    const allIncomingWorkflows = await waitForWorkflows({
      count: 2,
      query: {
        correlationId,
        status: "COMPLETED",
        workflowType: "incoming_message_handler"
      }
    })
    expect(allIncomingWorkflows).toHaveLength(2)

    const secondWorkflow = allIncomingWorkflows.find((w) => w.workflowId === newWorkflowId)
    expect(secondWorkflow?.reasonForIncompletion).toMatch(/Workflow is COMPLETED by TERMINATE task/)

    // search for the bichard_phase_1 workflows
    const allBichardWorkflows = await waitForWorkflows({
      count: 1,
      query: {
        correlationId,
        workflowType: "bichard_phase_1"
      }
    })
    expect(allBichardWorkflows).toHaveLength(1)
  })

  it("creates audit log events and starts the bichard_phase_1 workflow if the message is valid", async () => {
    // start the workflow
    const externalId = randomUUID()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`

    const externalCorrelationId = randomUUID()
    const inputMessage = String(fs.readFileSync("e2e-test/fixtures/input-message-001.xml"))
      .replace("EXTERNAL_CORRELATION_ID", externalCorrelationId)
      .replace("UNIQUE_HASH", randomUUID())

    await putFileToS3(inputMessage, s3Path, INCOMING_BUCKET_NAME!, s3Config)

    // search for the workflow
    const workflows = await waitForWorkflows({
      freeText: s3Path,
      query: {
        status: "COMPLETED",
        workflowType: "incoming_message_handler"
      }
    })
    expect(workflows).toHaveLength(1)

    // expect audit log and audit log event
    const apiClient = new AuditLogApiClient("http://localhost:7010", "test")
    const messages = await apiClient.getAuditLogs({
      externalCorrelationId
    })
    expect(messages).toHaveLength(1)

    const [message] = messages as AuditLogApiRecordOutput[]
    expect(message.events).toHaveLength(1)
    expect(message.events[0]).toHaveProperty("eventCode", EventCode.ReceivedIncomingHearingOutcome)
    expect(message).toHaveProperty("externalId", externalId)
    expect(message).toHaveProperty("caseId", "01ZD0303208")

    // wait for bichard_phase_1 workflow to exist

    const bichardProcessWorkflows = await waitForWorkflows({
      query: {
        correlationId: message.messageId,
        workflowType: "bichard_phase_1"
      }
    })
    expect(bichardProcessWorkflows).toHaveLength(1)
  })
})
