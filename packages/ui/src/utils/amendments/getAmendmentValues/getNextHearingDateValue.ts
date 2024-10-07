import { Amendments } from "types/Amendments"

const getNextHearingDateValue = (
  amendments: Amendments,
  offenceIndex: number,
  resultIndex: number
): string | undefined => {
  const validDateFormat = /^20\d{2}-\d{2}-\d{2}$/
  const nextHearingDateAmendment =
    amendments?.nextHearingDate &&
    amendments.nextHearingDate.find(
      (record) => record.offenceIndex === offenceIndex && record.resultIndex === resultIndex
    )?.value

  if (!nextHearingDateAmendment) {
    return ""
  }

  return validDateFormat.test(nextHearingDateAmendment) ? nextHearingDateAmendment : undefined
}

export default getNextHearingDateValue
