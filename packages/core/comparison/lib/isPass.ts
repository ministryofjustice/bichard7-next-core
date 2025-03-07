import type ComparisonResultDetail from "../types/ComparisonResultDetail"

const isPass = (result: ComparisonResultDetail): boolean =>
  result.auditLogEventsMatch &&
  result.triggersMatch &&
  result.exceptionsMatch &&
  (result.pncOperationsMatch === undefined || result.pncOperationsMatch) &&
  result.xmlOutputMatches &&
  result.xmlParsingMatches

export default isPass
