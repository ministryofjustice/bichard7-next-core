import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import PncGateway from "../../lib/PncGateway"
import createPncApiConfig from "../../lib/createPncApiConfig"
import phase1 from "../../phase1/phase1"
import { unvalidatedAHOSchema } from "../../phase1/schemas/annotatedHearingOutcome"
import { Phase1ResultType } from "../../phase1/types/Phase1Result"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

const taskDefName = "process_phase1"
const pncApiConfig = createPncApiConfig()

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"

const processPhase1: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: s3TaskDataFetcher<AnnotatedHearingOutcome>(unvalidatedAHOSchema, async (task) => {
    const { s3TaskData, s3TaskDataPath } = task.inputData
    const pncGateway = new PncGateway(pncApiConfig)
    const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)

    auditLogger.debug(EventCode.HearingOutcomeReceivedPhase1)

    const result = await phase1(s3TaskData, pncGateway, auditLogger)
    if (result.resultType === Phase1ResultType.success || result.resultType === Phase1ResultType.exceptions) {
      const maybeError = await putFileToS3(JSON.stringify(result), s3TaskDataPath, taskDataBucket, s3Config)
      if (isError(maybeError)) {
        return failed(`Could not put file to S3: ${s3TaskDataPath}`, maybeError.message)
      }
    }

    return completed(
      { resultType: result.resultType, auditLogEvents: result.auditLogEvents },
      ...result.auditLogEvents.map((e) => e.eventType)
    )
  })
}

export default processPhase1
