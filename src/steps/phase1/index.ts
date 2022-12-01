import processPhase1 from "src/steps/phase1/processPhase1"
import sendToPhase2 from "src/steps/phase1/sendToPhase2"
import storeAuditLogEvents from "src/steps/phase1/storeAuditLogEvents"
import storeInQuarantineBucket from "src/steps/phase1/storeInQuarantineBucket"

const main = async () => {
  const { auditLogEvents, message, messageIsRejected } = await processPhase1("fake S3 Path")
  storeAuditLogEvents(auditLogEvents)

  if (messageIsRejected) {
    console.error("Message rejected!")
    storeInQuarantineBucket(message)
  } else {
    console.log("Message processed, sending to phase 2")
    sendToPhase2(message)
  }
}

main()
