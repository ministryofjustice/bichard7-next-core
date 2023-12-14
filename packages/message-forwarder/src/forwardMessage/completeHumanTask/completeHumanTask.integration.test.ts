import "../../test/setup/setEnvironmentVariables"

import { startWorkflow, type Workflow } from "@moj-bichard7/common/conductor/conductorApi"
import type ConductorConfig from "@moj-bichard7/common/conductor/ConductorConfig"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import { waitForHumanTask } from "@moj-bichard7/common/test/conductor/waitForHumanTask"
import { uploadPncMock } from "@moj-bichard7/common/test/pnc/uploadPncMock"
import { putIncomingMessageToS3 } from "@moj-bichard7/common/test/s3/putIncomingMessageToS3"
import logger from "@moj-bichard7/common/utils/logger"
import { randomUUID } from "crypto"
import { completeHumanTask } from "./completeHumanTask"

import ignoredAHOFixture from "../../test/fixtures/ignored-aho.json"
import successExceptionsAHOFixture from "../../test/fixtures/success-exceptions-aho.json"
import successExceptionsPNCMock from "../../test/fixtures/success-exceptions-aho.pnc.json"

const conductorConfig: ConductorConfig = {
  url: "http://localhost:5002",
  username: "bichard",
  password: "password"
}

describe("completeHumanTask", () => {
  let correlationId: string
  let s3TaskDataPath: string

  let ignoredAHO: string
  let successExceptionsAHO: string

  beforeEach(async () => {
    correlationId = randomUUID()
    s3TaskDataPath = `${randomUUID()}.json`

    ignoredAHO = JSON.stringify(ignoredAHOFixture).replace("CORRELATION_ID", correlationId)
    successExceptionsAHO = JSON.stringify(successExceptionsAHOFixture).replace("CORRELATION_ID", correlationId)

    await createAuditLogRecord(correlationId)
  })

  it("throws if no waiting task is found for the workflow", async () => {
    await putIncomingMessageToS3(ignoredAHO, s3TaskDataPath, correlationId)

    const workflowId = await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    await waitForCompletedWorkflow(s3TaskDataPath)

    await expect(completeHumanTask({ workflowId } as Workflow, correlationId, conductorConfig)).rejects.toThrow(
      "Task not found"
    )
  })

  it("completes waiting task when found", async () => {
    await putIncomingMessageToS3(successExceptionsAHO, s3TaskDataPath, correlationId)
    await uploadPncMock(successExceptionsPNCMock)

    const workflowId = await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    const task1 = await waitForHumanTask(correlationId, conductorConfig)
    expect(task1.iteration).toBe(1)

    await completeHumanTask({ workflowId } as Workflow, correlationId, conductorConfig)

    // if we complete the human task without fixing the AHO, it'll go round again
    const task2 = await waitForHumanTask(correlationId, conductorConfig)
    expect(task2.iteration).toBe(2)
  })

  it("logs a completion metric", async () => {
    jest.spyOn(logger, "info")

    await putIncomingMessageToS3(successExceptionsAHO, s3TaskDataPath, correlationId)
    await uploadPncMock(successExceptionsPNCMock)

    const workflowId = await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    const task1 = await waitForHumanTask(correlationId, conductorConfig)
    expect(task1.iteration).toBe(1)

    await completeHumanTask({ workflowId } as Workflow, correlationId, conductorConfig)
    expect(logger.info).toHaveBeenCalledWith({ event: "message-forwarder:completed-waiting-task", correlationId })
  })
})
