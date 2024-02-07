import type { ConductorClient } from "@io-orkes/conductor-javascript"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { type AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { randomUUID } from "crypto"

const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME
if (!taskDataBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}
const s3Config = createS3Config()

export const startBichardProcess = async (
  workflowName: string,
  aho: AnnotatedHearingOutcome,
  correlationId: string,
  conductorClient: ConductorClient
) => {
  const s3TaskDataPath = `${randomUUID()}.json`
  const putResult = await putFileToS3(JSON.stringify(aho), s3TaskDataPath, taskDataBucket, s3Config)
  if (isError(putResult)) {
    return putResult
  }

  const workflowId = await conductorClient.workflowResource
    .startWorkflow1(workflowName, { s3TaskDataPath }, undefined, correlationId)
    .catch((e) => e as Error)
  if (isError(workflowId)) {
    return workflowId
  }

  logger.info({ event: "message-forwarder:started-workflow", workflowName, s3TaskDataPath, correlationId, workflowId })
}
