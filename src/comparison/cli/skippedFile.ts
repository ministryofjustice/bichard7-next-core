import type { ComparisonResult } from "../lib/compareMessage"

const skippedFile = (file: string): ComparisonResult => ({
  file,
  skipped: true,
  triggersMatch: false,
  exceptionsMatch: false,
  xmlOutputMatches: false,
  xmlParsingMatches: false
})

export default skippedFile
