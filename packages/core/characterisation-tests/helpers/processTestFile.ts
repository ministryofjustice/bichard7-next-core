import type TriggerCode from "bichard7-next-data-latest/types/TriggerCode"
import fs from "fs"
import orderBy from "lodash.orderby"
import path from "path"
import type { Trigger } from "../../types/Trigger"

type ComparisonTrigger = {
  code: TriggerCode
  identifier: string
}

type ComparisonFile = {
  incomingMessage: string
  annotatedHearingOutcome: string
  triggers: ComparisonTrigger[]
}

type ImportedComparison = {
  file: string
  incomingMessage: string
  annotatedHearingOutcome: string
  triggers: Trigger[]
}

export default (file: string): ImportedComparison => {
  const contents = fs.readFileSync(file)
  const { incomingMessage, annotatedHearingOutcome, triggers } = JSON.parse(contents.toString()) as ComparisonFile
  return {
    file: path.basename(file),
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
    annotatedHearingOutcome
  }
}
