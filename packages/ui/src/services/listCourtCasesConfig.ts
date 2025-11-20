type ListCourtCasesConfig = {
  BYPASS_PAGE_LIMIT: number
  CaseListQuery: string[]
  ResolvedExceptionsReport: string[]
}

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
  "courtCase.errorQualityChecked",
  "courtCase.triggerStatus",
  "courtCase.triggerQualityChecked",
  "courtCase.courtDate",
  "courtCase.ptiurn",
  "courtCase.courtName",
  "courtCase.resolutionTimestamp",
  "courtCase.errorResolvedBy",
  "courtCase.triggerResolvedBy",
  "courtCase.defendantName",
  "courtCase.errorLockedByUsername",
  "courtCase.triggerLockedByUsername",
  "courtCase.messageReceivedTimestamp"
]

const ResolvedExceptionsReport = [...CaseListQuery, "courtCase.hearingOutcome"]

const BYPASS_PAGE_LIMIT = -1

export default {
  CaseListQuery,
  BYPASS_PAGE_LIMIT,
  ResolvedExceptionsReport
} satisfies ListCourtCasesConfig
