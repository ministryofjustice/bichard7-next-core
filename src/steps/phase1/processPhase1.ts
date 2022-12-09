import postgres from "postgres"
import { isError } from "src/comparison/types"
import phase1 from "src/index"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import createDbConfig from "src/lib/createDbConfig"
import createPncApiConfig from "src/lib/createPncApiConfig"
import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import insertErrorListRecord from "src/lib/insertErrorListRecord"
import PncGateway from "src/lib/PncGateway"
import type Phase1Result from "src/types/Phase1Result"

const extractCorrelationIdFromAhoXml = (ahoXml: string): string => {
  const matchResult = ahoXml.match(/<msg:MessageIdentifier>([^<]*)<\/msg:MessageIdentifier>/)
  if (matchResult) {
    return matchResult[1]
  }
  return "Correlation ID Not Found"
}

const processPhase1 = async (s3Path: string): Promise<Phase1Result> => {
  const s3Config = createS3Config()
  const bucket = process.env.PHASE_1_BUCKET_NAME

  const pncApiConfig = createPncApiConfig()

  const dbConfig = createDbConfig()
  const db = postgres(dbConfig)

  if (!bucket) {
    throw Error("PHASE_1_BUCKET_NAME not set!")
  }

  const message = await getFileFromS3(s3Path, bucket, s3Config)
  if (isError(message)) {
    throw message
  }

  const correlationId = extractCorrelationIdFromAhoXml(message)
  const pncGateway = new PncGateway(pncApiConfig)
  const auditLogger = new CoreAuditLogger()

  let result: Phase1Result

  try {
    result = await phase1(message, pncGateway, auditLogger)
  } catch (err) {
    return {
      correlationId,
      auditLogEvents: [],
      failure: true
    }
  }

  if ("failure" in result) {
    return { ...result, correlationId }
  }

  if (result.triggers.length > 0 || result.hearingOutcome.Exceptions.length > 0) {
    // Store in Bichard DB if necessary
    const dbResult = await insertErrorListRecord(db, result)
    if (isError(dbResult)) {
      return {
        correlationId,
        auditLogEvents: [],
        failure: true
      }
    }
  }

  return result
}

export default processPhase1
