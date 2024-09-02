import "../../test/setup/setEnvironmentVariables"

import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import logger from "@moj-bichard7/common/utils/logger"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/core/types/PncUpdateDataset"
import { randomUUID } from "crypto"
import ahoFixture from "../../test/fixtures/ignored-aho.json"
import { startBichardProcess } from "./startBichardProcess"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"

const conductorClient = createConductorClient()

describe("startBichardProcess", () => {
  const pncUpdateDatasetFixture = { ...ahoFixture, PncOperations: [] }

  let correlationId: string
  let aho: string
  let pncUpdateDataset: string

  beforeEach(async () => {
    correlationId = randomUUID()
    aho = JSON.stringify(ahoFixture).replace("CORRELATION_ID", correlationId)
    pncUpdateDataset = JSON.stringify(pncUpdateDatasetFixture).replace("CORRELATION_ID", correlationId)

    await createAuditLogRecord(correlationId)
  })

  it("starts a new workflow with correlation ID and s3TaskDataPath from the AHO", async () => {
    await startBichardProcess(
      "bichard_phase_1",
      JSON.parse(aho) as AnnotatedHearingOutcome,
      correlationId,
      conductorClient
    )

    const workflow = await waitForCompletedWorkflow(correlationId)

    expect(workflow).toHaveProperty("correlationId", correlationId)
    expect(workflow.input).toMatch(/.*\.json/)
    expect(workflow.input).not.toContain("-phase2")
  })

  it("starts a new workflow with correlation ID and s3TaskDataPath from the PncUpdateDataset", async () => {
    await startBichardProcess(
      "bichard_phase_2",
      JSON.parse(pncUpdateDataset) as PncUpdateDataset,
      correlationId,
      conductorClient
    )

    const workflow = await waitForCompletedWorkflow(correlationId, "COMPLETED", 60000, "bichard_phase_2")

    expect(workflow).toHaveProperty("correlationId", correlationId)
    expect(workflow.input).toMatch(/.*-phase2\.json/)
  })

  it("logs a completion metric for Phase 1", async () => {
    jest.spyOn(logger, "info")

    await startBichardProcess(
      "bichard_phase_1",
      JSON.parse(aho) as AnnotatedHearingOutcome,
      correlationId,
      conductorClient
    )

    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "message-forwarder:started-workflow:phase-1",
        correlationId,
        workflowName: "bichard_phase_1",
        s3TaskDataPath: expect.stringMatching(/.*\.json/)
      })
    )
  })

  it("logs a completion metric for Phase 2", async () => {
    jest.spyOn(logger, "info")

    await startBichardProcess(
      "bichard_phase_2",
      JSON.parse(pncUpdateDataset) as PncUpdateDataset,
      correlationId,
      conductorClient
    )

    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "message-forwarder:started-workflow:phase-2",
        correlationId,
        workflowName: "bichard_phase_2",
        s3TaskDataPath: expect.stringMatching(/.*\.json/)
      })
    )
  })
})
