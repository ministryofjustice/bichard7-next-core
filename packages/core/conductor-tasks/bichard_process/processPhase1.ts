import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { z } from "zod"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import PncGateway from "../../lib/PncGateway"
import createPncApiConfig from "../../lib/createPncApiConfig"
import parseAhoJson from "../../phase1/parse/parseAhoJson"
import phase1 from "../../phase1/phase1"
import { Phase1ResultType } from "../../phase1/types/Phase1Result"

const taskDefName = "process_phase1"
const pncApiConfig = createPncApiConfig()

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"

const inputDataSchema = z.object({
  ahoS3Path: z.string()
})
type InputData = z.infer<typeof inputDataSchema>

const processPhase1: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const pncGateway = new PncGateway(pncApiConfig)
    const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
    const { ahoS3Path } = task.inputData

    const ahoFileContent = await getFileFromS3(ahoS3Path, taskDataBucket, s3Config)
    if (isError(ahoFileContent)) {
      logger.error(ahoFileContent)
      return failed(`Could not retrieve file from S3: ${ahoS3Path}`, ahoFileContent.message)
    }

    const parsedAho = parseAhoJson(JSON.parse(ahoFileContent))

    auditLogger.debug(EventCode.HearingOutcomeReceivedPhase1)

    const result = await phase1(parsedAho, pncGateway, auditLogger)

    if (result.resultType === Phase1ResultType.success || result.resultType === Phase1ResultType.exceptions) {
      const maybeError = await putFileToS3(JSON.stringify(result), ahoS3Path, taskDataBucket, s3Config)
      if (isError(maybeError)) {
        return failed(`Could not put file to S3: ${ahoS3Path}`, maybeError.message)
      }
    }

    return completed(
      { resultType: result.resultType, auditLogEvents: result.auditLogEvents },
      ...result.auditLogEvents.map((e) => e.eventType)
    )
  })
}

export default processPhase1
