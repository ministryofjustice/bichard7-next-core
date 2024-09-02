import type ComparisonResultDetail from "../types/ComparisonResultDetail"

const skippedFile = (file: string): ComparisonResultDetail => ({
  file,
  skipped: true,
  auditLogEventsMatch: false,
  triggersMatch: false,
  exceptionsMatch: false,
  xmlOutputMatches: false,
  xmlParsingMatches: false
})

export default skippedFile
