import type { PncAdjudication, PncOffence } from "../../../../../types/PncQueryResult"

const isMatchToPncAdjudication = (
  hoAdjudication: PncAdjudication,
  pncOffence: PncOffence,
  offenceReasonSequence: string | undefined
): boolean => {
  const pncOffenceSequence = pncOffence.offence.sequenceNumber.toString().padStart(3, "0")
  const pncAdjudication = pncOffence.adjudication

  return (
    !!offenceReasonSequence &&
    !!pncAdjudication &&
    offenceReasonSequence === pncOffenceSequence &&
    hoAdjudication.verdict === pncAdjudication.verdict &&
    hoAdjudication.plea === pncAdjudication.plea &&
    hoAdjudication.offenceTICNumber === pncAdjudication.offenceTICNumber &&
    hoAdjudication.sentenceDate?.getTime() === pncAdjudication.sentenceDate?.getTime()
  )
}

export default isMatchToPncAdjudication
