import "../test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "conductor" // has to be done prior to module imports

import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import waitForWorkflows from "@moj-bichard7/common/test/conductor/waitForWorkflows"
import { Client } from "@stomp/stompjs"
import { randomUUID } from "crypto"
import fs from "fs"
import forwardMessage from "./forwardMessage"

describe("forwardMessage", () => {
  let correlationId: string

  beforeEach(async () => {
    correlationId = randomUUID()
    await createAuditLogRecord(correlationId)
  })

  it("starts the bichard process if workflow doesn't already exist", async () => {
    const resubmittedMessage = String(fs.readFileSync("src/test/fixtures/incoming-message-bad-asn.xml")).replace(
      "CORRELATION_ID",
      correlationId
    )

    await forwardMessage(resubmittedMessage, expect.any(Client))
    const workflows = await waitForWorkflows({
      count: 1,
      query: { workflowType: "bichard_phase_1", status: "COMPLETED", correlationId }
    })
    expect(workflows).toHaveLength(1)
  })
})
