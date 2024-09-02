import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { z } from "zod"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import phase2 from "../../phase2/phase2"
import pncUpdateDatasetSchema from "../../phase2/schemas/pncUpdateDataset"
import { Phase2ResultType } from "../../phase2/types/Phase2Result"
import { unvalidatedHearingOutcomeSchema } from "../../schemas/unvalidatedHearingOutcome"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"
const lockKey: string = "lockedByWorkstream"
const ahoOrPncUpdateDatasetSchema = z.union([pncUpdateDatasetSchema, unvalidatedHearingOutcomeSchema])

const processPhase2: ConductorWorker = {
  taskDefName: "process_phase2",
  execute: s3TaskDataFetcher<AnnotatedHearingOutcome | PncUpdateDataset>(ahoOrPncUpdateDatasetSchema, async (task) => {
    const { s3TaskData, s3TaskDataPath, lockId } = task.inputData
    const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)

    auditLogger.debug(
      isPncUpdateDataset(s3TaskData)
        ? EventCode.ReceivedResubmittedHearingOutcome
        : EventCode.HearingOutcomeReceivedPhase2
    )

    const result = phase2(s3TaskData, auditLogger)

    const tags: Record<string, string> = lockId ? { [lockKey]: lockId } : {}
    const s3PutResult = await putFileToS3(JSON.stringify(result), s3TaskDataPath, taskDataBucket, s3Config, tags)
    if (isError(s3PutResult)) {
      return failed(`Could not put file to S3: ${s3TaskDataPath}`, s3PutResult.message)
    }

    const hasTriggersOrExceptionsOrIgnored =
      result.triggerGenerationAttempted ||
      result.outputMessage.Exceptions.length > 0 ||
      result.resultType === Phase2ResultType.ignored

    return completed(
      { resultType: result.resultType, auditLogEvents: result.auditLogEvents, hasTriggersOrExceptionsOrIgnored },
      ...result.auditLogEvents.map((e) => e.eventType)
    )
  })
}

export default processPhase2
