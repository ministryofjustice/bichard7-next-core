import processPhase1 from "src/steps/phase1/processPhase1"
import sendToPhase2 from "src/steps/phase1/sendToPhase2"
import storeAuditLogEvents from "src/steps/phase1/storeAuditLogEvents"
import storeInQuarantineBucket from "src/steps/phase1/storeInQuarantineBucket"

const main = async () => {
  const s3Path = "fake S3 Path"
  const result = await processPhase1(s3Path)

  await storeAuditLogEvents(result)

  if ("failure" in result) {
    console.error("Message rejected!")
    storeInQuarantineBucket(s3Path)
  } else {
    console.log("Message processed, sending to phase 2")
    sendToPhase2(result.hearingOutcome)
  }
}

main()
