import type { ConductorWorker } from "@io-orkes/conductor-javascript"

import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"

import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

import CoreAuditLogger from "../../lib/CoreAuditLogger"
import createPncApiConfig from "../../lib/createPncApiConfig"
import PncGateway from "../../lib/PncGateway"
import pncUpdateDatasetSchema from "../../phase2/schemas/pncUpdateDataset"
import phase3 from "../../phase3/phase3"

const pncApiConfig = createPncApiConfig()
const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"
const lockKey: string = "lockedByWorkstream"

const processPhase3: ConductorWorker = {
  taskDefName: "process_phase3",
  execute: s3TaskDataFetcher<PncUpdateDataset>(pncUpdateDatasetSchema, async (task) => {
    const { s3TaskData, s3TaskDataPath, lockId } = task.inputData
    const pncGateway = new PncGateway(pncApiConfig)
    const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase3)

    auditLogger.debug(EventCode.HearingOutcomeReceivedPhase3)

    const result = await phase3(s3TaskData, pncGateway, auditLogger)

    const tags: Record<string, string> = lockId ? { [lockKey]: lockId } : {}
    const s3PutResult = await putFileToS3(JSON.stringify(result), s3TaskDataPath, taskDataBucket, s3Config, tags)
    if (isError(s3PutResult)) {
      return failed(`Could not put file to S3: ${s3TaskDataPath}`, s3PutResult.message)
    }

    return completed(
      {
        resultType: result.resultType,
        auditLogEvents: result.auditLogEvents
      },
      ...result.auditLogEvents.map((e) => e.eventType)
    )
  })
}

export default processPhase3
