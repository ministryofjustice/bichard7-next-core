import { isError } from "src/comparison/types"
import phase1 from "src/index"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import PncGateway from "src/lib/pncGateway"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type AuditLogEvent from "src/types/AuditLogEvent"
import type BichardResultType from "src/types/BichardResultType"
import type { Trigger } from "src/types/Trigger"

type ProcessingSuccessResult = {
  hearingOutcome: AnnotatedHearingOutcome
  auditLogEvents: AuditLogEvent[]
  triggers: Trigger[]
}

type ProcessingFailureResult = {
  auditLogEvents: AuditLogEvent[]
  failure: true
}

type ProcessingResult = ProcessingSuccessResult | ProcessingFailureResult

const processPhase1 = async (s3Path: string): Promise<ProcessingResult> => {
  const config = createS3Config()
  const bucket = process.env.PHASE_1_BUCKET_NAME

  if (!bucket) {
    throw Error("PHASE_1_BUCKET_NAME not set!")
  }

  const message = await getFileFromS3(s3Path, bucket, config)
  if (isError(message)) {
    throw message
  }

  const pncGateway = new PncGateway()
  const auditLogger = new CoreAuditLogger()

  let result: BichardResultType

  try {
    result = phase1(message, pncGateway, auditLogger)
  } catch (err) {
    return {
      auditLogEvents: [],
      failure: true
    }
  }

  if (result.triggers.length > 0 || result.hearingOutcome.Exceptions.length > 0) {
    // Store in Bichard DB if necessary
  }

  return result
}

export default processPhase1
