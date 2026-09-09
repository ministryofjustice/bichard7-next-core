import "../../test/setup/setEnvironmentVariables"

import { createWorkflowExecutor } from "@moj-bichard7/common/conductor/createWorkflowExecutor"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import logger from "@moj-bichard7/common/utils/logger"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import { randomUUID } from "crypto"
import ahoFixture from "../../test/fixtures/ignored-aho.json"
import { startBichardProcess } from "./startBichardProcess"
import Phase from "@moj-bichard7/core/types/Phase"

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
    const workflowExecutor = await createWorkflowExecutor()
    await startBichardProcess(
      "bichard_phase_1",
      JSON.parse(aho) as AnnotatedHearingOutcome,
      correlationId,
      workflowExecutor
    )

    const workflow = await waitForCompletedWorkflow(correlationId)

    expect(workflow).toHaveProperty("correlationId", correlationId)
    expect(workflow.input).toMatch(/.*\.json/)
    expect(workflow.input).not.toContain("-phase2")
  })

  it("starts a new workflow with correlation ID and s3TaskDataPath from the PncUpdateDataset", async () => {
    const workflowExecutor = await createWorkflowExecutor()
    await startBichardProcess(
      "bichard_phase_2",
      JSON.parse(pncUpdateDataset) as PncUpdateDataset,
      correlationId,
      workflowExecutor,
      Phase.PNC_UPDATE
    )

    const workflow = await waitForCompletedWorkflow(correlationId, "COMPLETED", 60000, "bichard_phase_2")

    expect(workflow).toHaveProperty("correlationId", correlationId)
    expect(workflow.input).toMatch(/.*-phase2\.json/)
  })

  it("logs a completion metric for Phase 1", async () => {
    const workflowExecutor = await createWorkflowExecutor()

    jest.spyOn(logger, "info")

    await startBichardProcess(
      "bichard_phase_1",
      JSON.parse(aho) as AnnotatedHearingOutcome,
      correlationId,
      workflowExecutor
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
    const workflowExecutor = await createWorkflowExecutor()

    jest.spyOn(logger, "info")

    await startBichardProcess(
      "bichard_phase_2",
      JSON.parse(pncUpdateDataset) as PncUpdateDataset,
      correlationId,
      workflowExecutor,
      Phase.PNC_UPDATE
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
