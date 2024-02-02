import "../../test/setup/setEnvironmentVariables"

import createConductorConfig from "@moj-bichard7/common/conductor/createConductorConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import logger from "@moj-bichard7/common/utils/logger"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { randomUUID } from "crypto"
import ignoredAHOFixture from "../../test/fixtures/ignored-aho.json"
import { startBichardProcess } from "./startBichardProcess"

const conductorConfig = createConductorConfig()

describe("startBichardProcess", () => {
  let correlationId: string

  let ignoredAHO: string

  beforeEach(async () => {
    correlationId = randomUUID()

    ignoredAHO = JSON.stringify(ignoredAHOFixture).replace("CORRELATION_ID", correlationId)

    await createAuditLogRecord(correlationId)
  })

  it("starts a new workflow with correlation ID from the aho", async () => {
    await startBichardProcess(
      "bichard_phase_1",
      JSON.parse(ignoredAHO) as AnnotatedHearingOutcome,
      correlationId,
      conductorConfig
    )

    const workflow = await waitForCompletedWorkflow(correlationId)
    expect(workflow).toHaveProperty("correlationId", correlationId)
  })

  it("logs a completion metric", async () => {
    jest.spyOn(logger, "info")

    await startBichardProcess(
      "bichard_phase_1",
      JSON.parse(ignoredAHO) as AnnotatedHearingOutcome,
      correlationId,
      conductorConfig
    )
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "message-forwarder:started-workflow",
        correlationId,
        workflowName: "bichard_phase_1",
        s3TaskDataPath: expect.stringMatching(/.*\.json/)
      })
    )
  })
})
