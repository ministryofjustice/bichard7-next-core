import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import { unvalidatedHearingOutcomeSchema } from "../../schemas/unvalidatedHearingOutcome"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import phase2 from "../../phase2/phase2"

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"
const lockKey: string = "lockedByWorkstream"

const processPhase2: ConductorWorker = {
  taskDefName: "process_phase2",
  execute: s3TaskDataFetcher<AnnotatedHearingOutcome>(unvalidatedHearingOutcomeSchema, async (task) => {
    const { s3TaskData, s3TaskDataPath, lockId } = task.inputData
    const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)

    auditLogger.debug(EventCode.HearingOutcomeReceivedPhase2)

    const result = phase2(s3TaskData, auditLogger)

    const tags: Record<string, string> = lockId ? { [lockKey]: lockId } : {}
    const s3PutResult = await putFileToS3(JSON.stringify(result), s3TaskDataPath, taskDataBucket, s3Config, tags)
    if (isError(s3PutResult)) {
      return failed(`Could not put file to S3: ${s3TaskDataPath}`, s3PutResult.message)
    }

    const hasTriggersOrExceptions =
      ("triggers" in result && result.triggers.length > 0) ||
      ("hearingOutcome" in result && result.outputMessage.Exceptions.length > 0)

    return completed(
      { resultType: result.resultType, auditLogEvents: result.auditLogEvents, hasTriggersOrExceptions },
      ...result.auditLogEvents.map((e) => e.eventType)
    )
  })
}

export default processPhase2
