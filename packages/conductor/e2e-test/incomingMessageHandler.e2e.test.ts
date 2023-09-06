jest.setTimeout(9999999)
process.env.S3_ENDPOINT = "http://localhost:4566"
process.env.S3_AWS_ACCESS_KEY_ID = "test"
process.env.S3_AWS_SECRET_ACCESS_KEY = "test"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import MockMailServer from "@moj-bichard7/common/test/MockMailServer"
import { type OutputApiAuditLog } from "@moj-bichard7/common/types/AuditLogRecord"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import axios from "axios"
import { randomUUID } from "crypto"
import fs from "fs"
import promisePoller from "promise-poller"

const PHASE1_BUCKET_NAME = "phase1"
const s3Config = createS3Config()

const conductorUrl = process.env.CONDUCTOR_URL ?? "http://localhost:5002"
const headers = {
  auth: {
    username: "bichard",
    password: "password"
  }
}

type WorkflowSearchParams = {
  freeText: string
  query: {
    workflowType?: string
    status?: string
  }
}

const fetchWorkflowsByQuery = async (params: WorkflowSearchParams) => {
  const { freeText } = params
  const query = Object.entries(params.query)
    .map(([k, v]) => `${k}=${v}`)
    .join(" AND ")

  const response = await axios.get(
    `${conductorUrl}/api/workflow/search?freeText="${freeText}"&query="${query}"`,
    headers
  )

  if (response.data.totalHits === 0) {
    throw new Error("No workflows fetched")
  }
  return response.data.results
}
const findWorkflowByQuery = (query: WorkflowSearchParams) =>
  promisePoller({
    taskFn: () => fetchWorkflowsByQuery(query),
    retries: 100,
    interval: 100
  }).catch(() => {
    throw new Error("Could not find workflow")
  })

describe("Incoming message handler", () => {
  let mailServer: MockMailServer

  beforeAll(() => {
    mailServer = new MockMailServer(20002)
  })

  afterAll(() => {
    mailServer.stop()
  })

  it("records parsing failures as audit log events and messages common platform", async () => {
    // start the workflow
    const externalId = randomUUID()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`

    const externalCorrelationId = randomUUID()
    const inputMessage = String(fs.readFileSync("e2e-test/fixtures/input-message-routedata-001.xml")).replace(
      "EXTERNAL_CORRELATION_ID",
      externalCorrelationId
    )

    await putFileToS3(inputMessage, s3Path, PHASE1_BUCKET_NAME!, s3Config)

    // search for the workflow
    const workflows = await findWorkflowByQuery({
      freeText: s3Path,
      query: {
        workflowType: "incoming_message_handler",
        status: "COMPLETED"
      }
    })
    expect(workflows).toHaveLength(1)

    // expect audit log and audit log event
    const apiClient = new AuditLogApiClient("http://localhost:7010", "test")
    const messages = await apiClient.getMessages({
      externalCorrelationId
    })
    expect(messages).toHaveLength(1)

    const [message] = messages as OutputApiAuditLog[]
    expect(message.events).toHaveLength(1)
    expect(message.events[0]).toHaveProperty("eventCode", EventCode.MessageRejected)
    expect(message).toHaveProperty("externalId", externalId)

    const mail = await mailServer.getEmail("moj-bichard7@madetech.cjsm.net")
    if (isError(mail)) {
      throw mail
    }

    expect(mail.body).toMatch("Received date: 2023-08-31T14:48:00.000Z")
    expect(mail.body).toMatch(`Bichard internal message ID: ${message.messageId}`)
    expect(mail.body).toMatch(`Common Platform ID: ${externalId}`)
    expect(mail.body).toMatch(`PTIURN: ${message.caseId}`)
  })

  // eslint-disable-next-line
  // it("records duplicate message failures as audit log events", () => {})
})
