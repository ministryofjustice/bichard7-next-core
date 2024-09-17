import type { PncAdjudication, PncOffence } from "../../../../../types/PncQueryResult"

const isMatchToPncAdjudication = (
  hoAdjucation: PncAdjudication,
  pncOffence: PncOffence,
  offenceReasonSequence: string | undefined
): boolean => {
  const pncOffenceSequence = pncOffence.offence.sequenceNumber.toString().padStart(3, "0")
  const pncAdjudication = pncOffence.adjudication

  return (
    !!offenceReasonSequence &&
    !!pncAdjudication &&
    offenceReasonSequence === pncOffenceSequence &&
    hoAdjucation.verdict === pncAdjudication.verdict &&
    hoAdjucation.plea === pncAdjudication.plea &&
    hoAdjucation.offenceTICNumber === pncAdjudication.offenceTICNumber &&
    hoAdjucation.sentenceDate?.getTime() === pncAdjudication.sentenceDate?.getTime()
  )
}

export default isMatchToPncAdjudication
