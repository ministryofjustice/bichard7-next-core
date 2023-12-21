import "../../test/setup/setEnvironmentVariables"

import type ConductorConfig from "@moj-bichard7/common/conductor/ConductorConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import logger from "@moj-bichard7/common/utils/logger"
import { randomUUID } from "crypto"
import { startBichardProcess } from "./startBichardProcess"

import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import ignoredAHOFixture from "../../test/fixtures/ignored-aho.json"

const conductorConfig: ConductorConfig = {
  url: "http://localhost:5002",
  username: "bichard",
  password: "password"
}

describe("startBichardProcess", () => {
  let correlationId: string

  let ignoredAHO: string

  beforeEach(async () => {
    correlationId = randomUUID()

    ignoredAHO = JSON.stringify(ignoredAHOFixture).replace("CORRELATION_ID", correlationId)

    await createAuditLogRecord(correlationId)
  })

  it("starts a new workflow with correlation ID from the aho", async () => {
    await startBichardProcess(JSON.parse(ignoredAHO) as AnnotatedHearingOutcome, correlationId, conductorConfig)

    const workflow = await waitForCompletedWorkflow(correlationId)
    expect(workflow).toHaveProperty("correlationId", correlationId)
  })

  it("logs a completion metric", async () => {
    jest.spyOn(logger, "info")

    await startBichardProcess(JSON.parse(ignoredAHO) as AnnotatedHearingOutcome, correlationId, conductorConfig)
    expect(logger.info).toHaveBeenCalledWith({ event: "message-forwarder:started-workflow", correlationId })
  })
})
