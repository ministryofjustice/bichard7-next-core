import processPhase1 from "src/steps/phase1/processPhase1"
import sendToPhase2 from "src/steps/phase1/sendToPhase2"
import storeAuditLogEvents from "src/steps/phase1/storeAuditLogEvents"
import storeInQuarantineBucket from "src/steps/phase1/storeInQuarantineBucket"
import { Phase1ResultType } from "src/types/Phase1Result"

const main = async () => {
  const s3Path = "fake S3 Path"
  const result = await processPhase1(s3Path)

  await storeAuditLogEvents(result)

  if (result.resultType === Phase1ResultType.failure) {
    console.error("Message rejected!")
    storeInQuarantineBucket(s3Path)
  } else if (result.resultType === Phase1ResultType.success) {
    console.log("Message processed, sending to phase 2")
    sendToPhase2(result)
  }
}

main()
