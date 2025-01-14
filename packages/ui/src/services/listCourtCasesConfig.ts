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

const BYPASS_PAGE_LIMIT = -1

export default {
  CaseListQuery,
  ResolvedExceptionsReport,
  BYPASS_PAGE_LIMIT
}
