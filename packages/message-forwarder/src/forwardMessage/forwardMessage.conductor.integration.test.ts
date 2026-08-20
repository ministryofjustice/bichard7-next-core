import "../test/setup/setEnvironmentVariables"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import waitForWorkflows from "@moj-bichard7/common/test/conductor/waitForWorkflows"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import fs from "fs"
import type { Sql } from "postgres"
import postgres from "postgres"
import createStompClient from "../createStompClient"
import { clearTables, insertCase } from "../test/setup/database"
import forwardMessage from "./forwardMessage"

process.env.DESTINATION_TYPE = "conductor" // has to be done prior to module imports

const stompClient = createStompClient()
const database = postgres(createDbConfig(true))
const testDatabase = postgres(createDbConfig())

describe("forwardMessage", () => {
  let correlationId: string

  beforeEach(async () => {
    jest.resetModules()
    correlationId = randomUUID()
    await createAuditLogRecord(correlationId)
    await clearTables(testDatabase)
  })

  afterAll(async () => {
    await database.end()
    await testDatabase.end()
  })

  it.each([
    { conductorWorkflow: "bichard_phase_1", message: "src/test/fixtures/incoming-message-bad-asn.xml" },
    { conductorWorkflow: "bichard_phase_2", message: "src/test/fixtures/pnc-update-dataset.xml" }
  ])(
    "starts $conductorWorkflow Conductor workflow if workflow doesn't already exist",
    async ({ conductorWorkflow, message }) => {
      process.env.CONDUCTOR_WORKFLOW = conductorWorkflow
      const conductorClient = await createConductorClient()

      await insertCase(testDatabase, { message_id: correlationId })
      const resubmittedMessage = String(fs.readFileSync(message)).replace("CORRELATION_ID", correlationId)

      await forwardMessage(resubmittedMessage, stompClient, conductorClient, database)

      const workflows = await waitForWorkflows({
        count: 1,
        query: { workflowType: conductorWorkflow, status: "COMPLETED", correlationId }
      })
      expect(workflows).toHaveLength(1)
    }
  )

  it("returns error when it fails to fetch the police query", async () => {
    process.env.CONDUCTOR_WORKFLOW = "bichard_phase_2"
    const conductorClient = await createConductorClient()

    await insertCase(testDatabase, { message_id: correlationId })
    const messagePath = "src/test/fixtures/pnc-update-dataset.xml"
    const resubmittedMessage = String(fs.readFileSync(messagePath)).replace("CORRELATION_ID", correlationId)

    const fakeDatabase = jest.fn().mockRejectedValue(Error("Dummy database error")) as unknown as Sql
    const result = await forwardMessage(resubmittedMessage, stompClient, conductorClient, fakeDatabase)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Dummy database error")
  })
})
