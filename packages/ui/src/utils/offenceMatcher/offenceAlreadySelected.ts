import { Amendments } from "types/Amendments"
import offenceMatcherSelectValue from "./offenceMatcherSelectValue"

const offenceAlreadySelected = (
  amendments: Amendments,
  offenceIndex: number,
  sequenceNumber: number,
  courtCaseReference: string
): boolean => {
  const knownMatches: string[] = []

  amendments.offenceCourtCaseReferenceNumber?.forEach((offenceCcr) => {
    const offenceReasonSequence = amendments.offenceReasonSequence?.find(
      (a) => a.offenceIndex === offenceCcr.offenceIndex && a.offenceIndex !== offenceIndex
    )

    if (offenceReasonSequence?.value !== undefined && offenceReasonSequence.value >= 0) {
      knownMatches.push(offenceMatcherSelectValue(offenceReasonSequence.value, offenceCcr.value))
    }
  })

  return knownMatches.includes(offenceMatcherSelectValue(sequenceNumber, courtCaseReference))
}

export default offenceAlreadySelected
