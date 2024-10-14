const CaseListQuery = [
  "courtCase.errorId",
  "courtCase.triggerCount",
  "courtCase.isUrgent",
  "courtCase.asn",
  "courtCase.errorReport",
  "courtCase.errorReason",
  "courtCase.triggerReason",
  "courtCase.errorCount",
  "courtCase.errorStatus",
  "courtCase.triggerStatus",
  "courtCase.courtDate",
  "courtCase.ptiurn",
  "courtCase.courtName",
  "courtCase.resolutionTimestamp",
  "courtCase.errorResolvedBy",
  "courtCase.triggerResolvedBy",
  "courtCase.defendantName",
  "courtCase.errorLockedByUsername",
  "courtCase.triggerLockedByUsername"
]

const ResolvedExceptionsReport = [...CaseListQuery, "courtCase.messageReceivedTimestamp", "courtCase.hearingOutcome"]

export default {
  CaseListQuery,
  ResolvedExceptionsReport
}
