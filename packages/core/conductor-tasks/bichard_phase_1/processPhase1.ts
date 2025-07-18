import type { ConductorWorker } from "@io-orkes/conductor-javascript"

import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import postgres from "postgres"

import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

import CoreAuditLogger from "../../lib/auditLog/CoreAuditLogger"
import getTriggersCount from "../../lib/database/getTriggersCount"
import createLedsApiConfig from "../../lib/leds/createLedsApiConfig"
import LedsGateway from "../../lib/leds/LedsGateway"
import phase1 from "../../phase1/phase1"
import { unvalidatedHearingOutcomeSchema } from "../../schemas/unvalidatedHearingOutcome"

const ledsApiConfig = createLedsApiConfig()
const dbConfig = createDbConfig()

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"
const lockKey: string = "lockedByWorkstream"

const processPhase1: ConductorWorker = {
  taskDefName: "process_phase1",
  execute: s3TaskDataFetcher<AnnotatedHearingOutcome>(unvalidatedHearingOutcomeSchema, async (task) => {
    const { s3TaskData, s3TaskDataPath, lockId } = task.inputData
    const ledsGateway = new LedsGateway(ledsApiConfig)
    const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
    const db = postgres(dbConfig)

    auditLogger.debug(EventCode.HearingOutcomeReceivedPhase1)

    const result = await phase1(s3TaskData, ledsGateway, auditLogger)

    const tags: Record<string, string> = lockId ? { [lockKey]: lockId } : {}
    const s3PutResult = await putFileToS3(JSON.stringify(result), s3TaskDataPath, taskDataBucket, s3Config, tags)
    if (isError(s3PutResult)) {
      return failed(`Could not put file to S3: ${s3TaskDataPath}`, s3PutResult.message)
    }

    let hasTriggersOrExceptions =
      ("triggers" in result && result.triggers.length > 0) ||
      ("hearingOutcome" in result && result.hearingOutcome.Exceptions.length > 0)

    if (!hasTriggersOrExceptions) {
      const existingTriggersCount = await getTriggersCount(db, result.correlationId)
      if (isError(existingTriggersCount)) {
        return failed("Could not query triggers table", existingTriggersCount.message)
      }

      hasTriggersOrExceptions = existingTriggersCount > 0
    }

    return completed(
      { resultType: result.resultType, auditLogEvents: result.auditLogEvents, hasTriggersOrExceptions },
      ...result.auditLogEvents.map((e) => e.eventType)
    )
  })
}

export default processPhase1
