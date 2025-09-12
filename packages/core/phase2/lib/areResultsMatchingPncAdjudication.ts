import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceOffence } from "@moj-bichard7/common/types/PoliceQueryResult"

import createPoliceAdjudicationFromAho from "../../lib/createPoliceAdjudicationFromAho/createPoliceAdjudicationFromAho"

const areResultsMatchingPncAdjudication = (
  results: Result[],
  hearingDate: Date,
  offenceReasonSequence: string,
  pncOffence: PoliceOffence
): boolean => {
  const hoAdjudication = createPoliceAdjudicationFromAho(results, hearingDate)
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
