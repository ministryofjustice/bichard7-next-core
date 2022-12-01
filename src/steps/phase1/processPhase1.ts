import { isError } from "src/comparison/types"
import phase1 from "src/index"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import PncGateway from "src/lib/pncGateway"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type AuditLogEvent from "src/types/AuditLogEvent"
import type { Trigger } from "src/types/Trigger"

type ProcessingResult = {
  auditLogEvents: AuditLogEvent[]
  ahoXml: string
  messageIsRejected: boolean
}

const processPhase1 = async (s3Path: string): Promise<ProcessingResult> => {
  const config = createS3Config()
  const bucket = process.env.INCOMING_MESSAGE_BUCKET_NAME

  if (!bucket) {
    throw Error("INCOMING_MESSAGE_BUCKET_NAME not set!")
  }

  const message = await getFileFromS3(s3Path, bucket, config)
  if (isError(message)) {
    throw message
  }

  const pncGateway = new PncGateway()
  const auditLogger = new CoreAuditLogger()

  let events: AuditLogEvent[]
  let hearingOutcome: AnnotatedHearingOutcome
  let triggers: Trigger[]

  try {
    const result = phase1(message, pncGateway, auditLogger)
    events = result.events
    hearingOutcome = result.hearingOutcome
    triggers = result.triggers
  } catch (err) {
    return {
      ahoXml: message,
      auditLogEvents: [],
      messageIsRejected: true
    }
  }

  if (triggers.length > 0 || hearingOutcome.Exceptions.length > 0) {
    // Store in Bichard DB if necessary
  }

  const ahoXml = convertAhoToXml(hearingOutcome)

  return {
    ahoXml,
    auditLogEvents: events,
    messageIsRejected: false
  }
}

export default processPhase1
