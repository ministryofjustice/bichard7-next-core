import type Phase1Result from "src/types/Phase1Result"

const storeAuditLogEvents = (phase1Result: Phase1Result) => {
  console.log(phase1Result.correlationId)
  // axios.post()
}

export default storeAuditLogEvents
