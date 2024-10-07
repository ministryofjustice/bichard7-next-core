import { Amendments } from "types/Amendments"

const getNextHearingLocationValue = (
  amendmentRecords: Amendments,
  offenceIndex: number,
  resultIndex: number
): string | undefined =>
  amendmentRecords?.nextSourceOrganisation &&
  amendmentRecords.nextSourceOrganisation.find(
    (record) => record.offenceIndex === offenceIndex && record.resultIndex === resultIndex
  )?.value

export default getNextHearingLocationValue
