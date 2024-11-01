import type { PncOffence } from "../../types/PncQueryResult"
import type { Result } from "../../types/AnnotatedHearingOutcome"
import createPncAdjudicationFromAho from "./createPncAdjudicationFromAho"

const isMatchToPncAdjudication = (
  results: Result[],
  hearingDate: Date,
  pncOffence: PncOffence,
  offenceReasonSequence: string
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

export default isMatchToPncAdjudication
