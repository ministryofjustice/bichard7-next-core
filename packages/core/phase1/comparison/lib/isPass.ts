import type ComparisonResultDetail from "../types/ComparisonResultDetail"

const isPass = (result: ComparisonResultDetail): boolean =>
  result.triggersMatch && result.exceptionsMatch && result.xmlOutputMatches && result.xmlParsingMatches

export default isPass
