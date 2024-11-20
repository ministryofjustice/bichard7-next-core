import "../test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "conductor" // has to be done prior to module imports

import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import waitForWorkflows from "@moj-bichard7/common/test/conductor/waitForWorkflows"
import { randomUUID } from "crypto"
import fs from "fs"

import createStompClient from "../createStompClient"
import forwardMessage from "./forwardMessage"

const stompClient = createStompClient()
const conductorClient = createConductorClient()

describe("forwardMessage", () => {
  let correlationId: string

  beforeEach(async () => {
    jest.resetModules()
    correlationId = randomUUID()
    await createAuditLogRecord(correlationId)
  })

  it.each([
    { conductorWorkflow: "bichard_phase_1", message: "src/test/fixtures/incoming-message-bad-asn.xml" },
    { conductorWorkflow: "bichard_phase_2", message: "src/test/fixtures/pnc-update-dataset.xml" }
  ])(
    "starts $conductorWorkflow Conductor workflow if workflow doesn't already exist",
    async ({ conductorWorkflow, message }) => {
      process.env.CONDUCTOR_WORKFLOW = conductorWorkflow
      const resubmittedMessage = String(fs.readFileSync(message)).replace("CORRELATION_ID", correlationId)

      await forwardMessage(resubmittedMessage, stompClient, conductorClient)

      const workflows = await waitForWorkflows({
        count: 1,
        query: { correlationId, status: "COMPLETED", workflowType: conductorWorkflow }
      })
      expect(workflows).toHaveLength(1)
    }
  )
})
