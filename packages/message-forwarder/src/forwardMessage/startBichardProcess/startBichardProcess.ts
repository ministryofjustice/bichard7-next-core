import type { ConductorClient } from "@io-orkes/conductor-javascript"
import type { PncUpdateDataset } from "@moj-bichard7/core/types/PncUpdateDataset"

import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { type AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import Phase from "@moj-bichard7/core/types/Phase"
import { randomUUID } from "crypto"

const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME
if (!taskDataBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

const s3Config = createS3Config()

export const startBichardProcess = async (
  workflowName: string,
  incomingMessage: AnnotatedHearingOutcome | PncUpdateDataset,
  correlationId: string,
  conductorClient: ConductorClient,
  phase: Phase = Phase.HEARING_OUTCOME
) => {
  const s3TaskDataPath = `${randomUUID()}${phase === Phase.PNC_UPDATE ? "-phase2" : ""}.json`

  const putResult = await putFileToS3(JSON.stringify(incomingMessage), s3TaskDataPath, taskDataBucket, s3Config)
  if (isError(putResult)) {
    return putResult
  }

  const workflowId = await conductorClient.workflowResource
    .startWorkflow1(workflowName, { s3TaskDataPath }, undefined, correlationId)
    .catch((e) => e as Error)
  if (isError(workflowId)) {
    return workflowId
  }

  logger.info({
    correlationId,
    event: `message-forwarder:started-workflow:${phase === Phase.PNC_UPDATE ? "phase-2" : "phase-1"}`,
    s3TaskDataPath,
    workflowId,
    workflowName
  })
}
