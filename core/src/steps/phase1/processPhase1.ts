import postgres from "postgres"
import { isError } from "src/comparison/types"
import phase1 from "src/index"
import getAuditLogEvent from "src/lib/auditLog/getAuditLogEvent"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import createDbConfig from "src/lib/createDbConfig"
import createPncApiConfig from "src/lib/createPncApiConfig"
import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import insertErrorListRecord from "src/lib/insertErrorListRecord"
import PncGateway from "src/lib/PncGateway"
import type Phase1Result from "src/types/Phase1Result"
import { Phase1ResultType } from "src/types/Phase1Result"

const bucket = process.env.PHASE_1_BUCKET_NAME
if (!bucket) {
  throw Error("PHASE_1_BUCKET_NAME environment variable is required")
}
const s3Config = createS3Config()
const pncApiConfig = createPncApiConfig()
const dbConfig = createDbConfig()

const extractCorrelationIdFromAhoXml = (ahoXml: string): string => {
  const matchResult = ahoXml.match(/<msg:MessageIdentifier>([^<]*)<\/msg:MessageIdentifier>/)
  if (matchResult) {
    return matchResult[1]
  }
  return "Correlation ID Not Found"
}

const processPhase1 = async (s3Path: string): Promise<Phase1Result> => {
  const db = postgres(dbConfig)
  const pncGateway = new PncGateway(pncApiConfig)
  const auditLogger = new CoreAuditLogger()

  const message = await getFileFromS3(s3Path, bucket, s3Config)
  if (isError(message)) {
    throw message
  }

  auditLogger.logEvent(
    getAuditLogEvent("hearing-outcome.received", "debug", "Hearing outcome received", "CoreHandler", {})
  )

  const correlationId = extractCorrelationIdFromAhoXml(message)

  const result = await phase1(message, pncGateway, auditLogger)

  if (result.resultType === Phase1ResultType.failure || result.resultType === Phase1ResultType.ignored) {
    return { ...result, correlationId }
  }

  if (result.triggers.length > 0 || result.hearingOutcome.Exceptions.length > 0) {
    // Store in Bichard DB if necessary
    const dbResult = await insertErrorListRecord(db, result)
    if (isError(dbResult)) {
      return {
        correlationId,
        auditLogEvents: [],
        resultType: Phase1ResultType.failure
      }
    }
  }

  return result
}

export default processPhase1
