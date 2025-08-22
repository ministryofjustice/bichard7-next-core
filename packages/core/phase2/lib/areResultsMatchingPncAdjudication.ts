import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncOffence } from "@moj-bichard7/common/types/PncQueryResult"

import createPncAdjudicationFromAho from "../../lib/createPncAdjudicationFromAho/createPncAdjudicationFromAho"

const areResultsMatchingPncAdjudication = (
  results: Result[],
  hearingDate: Date,
  offenceReasonSequence: string,
  pncOffence: PncOffence
): boolean => {
  const hoAdjudication = createPncAdjudicationFromAho(results, hearingDate)
  const pncAdjudication = pncOffence.adjudication
  const pncOffenceSequence = pncOffence.offence.sequenceNumber.toString().padStart(3, "0")

  return (
    !!hoAdjudication &&
    !!pncAdjudication &&
    offenceReasonSequence === pncOffenceSequence &&
    hoAdjudication.verdict === pncAdjudication.verdict &&
    hoAdjudication.plea === pncAdjudication.plea &&
    hoAdjudication.offenceTICNumber === pncAdjudication.offenceTICNumber &&
    hoAdjudication.sentenceDate?.getTime() === pncAdjudication.sentenceDate?.getTime()
  )
}

export default areResultsMatchingPncAdjudication
