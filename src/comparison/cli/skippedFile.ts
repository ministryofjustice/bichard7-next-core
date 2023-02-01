import type ComparisonResult from "../types/ComparisonResult"

const skippedFile = (file: string): ComparisonResult => ({
  file,
  skipped: true,
  triggersMatch: false,
  exceptionsMatch: false,
  xmlOutputMatches: false,
  xmlParsingMatches: false
})

export default skippedFile
