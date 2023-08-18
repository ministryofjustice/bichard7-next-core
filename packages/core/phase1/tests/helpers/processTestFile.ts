import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import fs from "fs"
import orderBy from "lodash.orderby"
import path from "path"
import type { Comparison } from "phase1/comparison/types/ComparisonFile"

export const parseComparisonFile = (contents: string, file?: string): Comparison => {
  let parsed: Comparison
  try {
    parsed = JSON.parse(contents.replace(/Â£/g, "£"), dateReviver) as Comparison
  } catch (e) {
    console.error(`Error parsing file: ${file}`)
    throw e
  }

  if ("triggers" in parsed) {
    parsed.triggers = orderBy(
      parsed.triggers.map((t) => {
        if ("identifier" in t && t.identifier) {
          t.offenceSequenceNumber = parseInt(t.identifier, 10)
        }
        delete t.identifier
        return t
      }),
      ["code", "offenceSequenceNumber"]
    )
  }

  return {
    ...parsed,
    file
  }
}

export default (file: string): Comparison => {
  const contents = fs.readFileSync(file).toString()
  return parseComparisonFile(contents, path.basename(file))
}
