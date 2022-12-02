import { isError } from "src/comparison/types"
import phase1 from "src/index"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import createPncApiConfig from "src/lib/createPncApiConfig"
import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import PncGateway from "src/lib/pncGateway"
import type Phase1Result from "src/types/Phase1Result"

const processPhase1 = async (s3Path: string): Promise<Phase1Result> => {
  const s3Config = createS3Config()
  const bucket = process.env.PHASE_1_BUCKET_NAME

  const pncApiConfig = createPncApiConfig()

  if (!bucket) {
    throw Error("PHASE_1_BUCKET_NAME not set!")
  }

  const message = await getFileFromS3(s3Path, bucket, s3Config)
  if (isError(message)) {
    throw message
  }

  const pncGateway = new PncGateway(pncApiConfig)
  const auditLogger = new CoreAuditLogger()

  let result: Phase1Result

  try {
    result = await phase1(message, pncGateway, auditLogger)
  } catch (err) {
    return {
      auditLogEvents: [],
      failure: true
    }
  }

  if ("failure" in result) {
    return result
  }

  if (result.triggers.length > 0 || result.hearingOutcome.Exceptions.length > 0) {
    // Store in Bichard DB if necessary
  }

  return result
}

export default processPhase1
