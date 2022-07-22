import type { ComparisonResult } from "src/comparison/compare"
import compare from "src/comparison/compare"

const processFile = (contents: string, fileName: string): ComparisonResult => {
  const result = compare(contents, true)
  result.file = fileName
  return result
}

export default processFile
