import type { PncAdjudication, PncOffence } from "../../../../../types/PncQueryResult"

const isMatchToPncAdj = (
  hoAdjucation: PncAdjudication,
  pncOffence: PncOffence,
  offenceReasonSequence: string | undefined
): boolean => {
  const pncOffenceSequence = pncOffence.offence.sequenceNumber.toString().padStart(3, "0")

  return (
    !!offenceReasonSequence &&
    offenceReasonSequence === pncOffenceSequence &&
    !!pncOffence.adjudication &&
    hoAdjucation.verdict === pncOffence.adjudication.verdict &&
    hoAdjucation.plea === pncOffence.adjudication.plea &&
    hoAdjucation.offenceTICNumber === pncOffence.adjudication.offenceTICNumber &&
    hoAdjucation.sentenceDate?.getTime() === pncOffence.adjudication.sentenceDate?.getTime()
  )
}

export default isMatchToPncAdj
