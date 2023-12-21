import "../test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "conductor" // has to be done prior to module imports

import createConductorConfig from "@moj-bichard7/common/conductor/createConductorConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForHumanTask } from "@moj-bichard7/common/test/conductor/waitForHumanTask"
import { Client } from "@stomp/stompjs"
import { randomUUID } from "crypto"
import fs from "fs"
import forwardMessage from "./forwardMessage"

const conductorConfig = createConductorConfig()

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
    const task1 = await waitForHumanTask(correlationId, conductorConfig)
    expect(task1.iteration).toBe(1)
  })
})
