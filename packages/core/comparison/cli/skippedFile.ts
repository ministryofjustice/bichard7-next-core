import type ComparisonResultDetail from "../types/ComparisonResultDetail"

const skippedFile = (file: string): ComparisonResultDetail => ({
  auditLogEventsMatch: false,
  exceptionsMatch: false,
  file,
  skipped: true,
  triggersMatch: false,
  xmlOutputMatches: false,
  xmlParsingMatches: false
})

export default skippedFile
