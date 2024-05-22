import type { PncAdjudication, PncOffence } from "../types/PncQueryResult"

const isMatchToPncAdj = (
  hoAdjucation: PncAdjudication,
  pncOffence: PncOffence,
  offenceReasonSequence: string | undefined
): boolean => {
  const offenceReasonSequenceNumber = offenceReasonSequence ? parseInt(offenceReasonSequence, 10) : undefined

  return (
    !!offenceReasonSequence &&
    offenceReasonSequenceNumber === pncOffence.offence.sequenceNumber &&
    !!pncOffence.adjudication &&
    hoAdjucation.verdict === pncOffence.adjudication.verdict &&
    hoAdjucation.plea === pncOffence.adjudication.plea &&
    hoAdjucation.offenceTICNumber === pncOffence.adjudication.offenceTICNumber &&
    datesMatch(hoAdjucation.sentenceDate, pncOffence.adjudication.sentenceDate)
  )
}

const datesMatch = (date1: Date, date2: Date) => {
  if (!date1 && !date2) {
    return true
  }

  return date1.getTime() === date2.getTime()
}

export default isMatchToPncAdj
