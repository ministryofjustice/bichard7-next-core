import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceOffence } from "@moj-bichard7/common/types/PoliceQueryResult"

import createPoliceAdjudicationFromAho from "../../lib/createPoliceAdjudicationFromAho/createPoliceAdjudicationFromAho"

const areResultsMatchingPoliceAdjudication = (
  results: Result[],
  hearingDate: Date,
  offenceReasonSequence: string,
  policeOffence: PoliceOffence
): boolean => {
  const hoAdjudication = createPoliceAdjudicationFromAho(results, hearingDate)
  const policeAdjudication = policeOffence.adjudication
  const policeOffenceSequence = policeOffence.offence.sequenceNumber.toString().padStart(3, "0")

  return (
    !!hoAdjudication &&
    !!policeAdjudication &&
    offenceReasonSequence === policeOffenceSequence &&
    hoAdjudication.verdict === policeAdjudication.verdict &&
    hoAdjudication.plea === policeAdjudication.plea &&
    hoAdjudication.offenceTICNumber === policeAdjudication.offenceTICNumber &&
    hoAdjudication.sentenceDate?.getTime() === policeAdjudication.sentenceDate?.getTime()
  )
}

export default areResultsMatchingPoliceAdjudication
