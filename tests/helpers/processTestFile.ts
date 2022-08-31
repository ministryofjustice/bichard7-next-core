import fs from "fs"
import orderBy from "lodash.orderby"
import path from "path"
import type { ImportedComparison } from "../../src/comparison/types/ImportedComparison"
import type { Trigger } from "../../src/types/Trigger"
import type { TriggerCode } from "../../src/types/TriggerCode"

type ComparisonTrigger = {
  code: TriggerCode
  identifier: string
}

type ComparisonFile = {
  incomingMessage: string
  annotatedHearingOutcome: string
  standingDataVersion: string
  triggers: ComparisonTrigger[]
}

export const processTestString = (contents: string, file?: string): ImportedComparison => {
  const { incomingMessage, annotatedHearingOutcome, triggers, standingDataVersion } = JSON.parse(
    contents
  ) as ComparisonFile
  return {
    file,
    triggers: orderBy(
      triggers.map(({ code, identifier }) => {
        const result: Trigger = { code }
        if (identifier) {
          result.offenceSequenceNumber = parseInt(identifier, 10)
        }
        return result
      }),
      ["code", "offenceSequenceNumber"]
    ),
    incomingMessage,
    annotatedHearingOutcome,
    standingDataVersion
  }
}

export default (file: string): ImportedComparison => {
  const contents = fs.readFileSync(file).toString()
  return processTestString(contents, path.basename(file))
}
