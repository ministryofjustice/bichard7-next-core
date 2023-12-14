import type ConductorConfig from "@moj-bichard7/common/conductor/ConductorConfig"
import { startWorkflow } from "@moj-bichard7/common/conductor/conductorApi"
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
  aho: AnnotatedHearingOutcome,
  correlationId: string,
  conductorConfig: ConductorConfig
) => {
  const s3TaskDataPath = `${randomUUID()}.json`
  const putResult = await putFileToS3(JSON.stringify(aho), s3TaskDataPath, taskDataBucket, s3Config)
  if (isError(putResult)) {
    throw putResult
  }

  await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
  logger.info(`Started new workflow in Conductor (${correlationId})`)
}
