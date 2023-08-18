import type ComparisonResultDetail from "phase1/comparison/types/ComparisonResultDetail"

const skippedFile = (file: string): ComparisonResultDetail => ({
  file,
  skipped: true,
  triggersMatch: false,
  exceptionsMatch: false,
  xmlOutputMatches: false,
  xmlParsingMatches: false
})

export default skippedFile
