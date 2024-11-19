import type TriggerCode from "@moj-bichard7-developers/bichard7-next-data/types/TriggerCode"

import fs from "fs"
import orderBy from "lodash.orderby"
import path from "path"

import type { Trigger } from "../../types/Trigger"

type ComparisonTrigger = {
  code: TriggerCode
  identifier: string
}

type ComparisonFile = {
  annotatedHearingOutcome: string
  incomingMessage: string
  triggers: ComparisonTrigger[]
}

type ImportedComparison = {
  annotatedHearingOutcome: string
  file: string
  incomingMessage: string
  triggers: Trigger[]
}

export default (file: string): ImportedComparison => {
  const contents = fs.readFileSync(file)
  const { annotatedHearingOutcome, incomingMessage, triggers } = JSON.parse(contents.toString()) as ComparisonFile
  return {
    annotatedHearingOutcome,
    file: path.basename(file),
    incomingMessage,
    triggers: orderBy(
      triggers.map(({ code, identifier }) => {
        const result: Trigger = { code }
        if (identifier) {
          result.offenceSequenceNumber = parseInt(identifier, 10)
        }

        return result
      }),
      ["code", "offenceSequenceNumber"]
    )
  }
}
