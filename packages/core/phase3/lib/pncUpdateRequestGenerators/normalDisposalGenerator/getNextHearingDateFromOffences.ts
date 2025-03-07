import type { Offence } from "../../../../types/AnnotatedHearingOutcome"

const getNextHearingDateFromOffences = (offences: Offence[]): Date | undefined => {
  const nextHearingDate =
    offences.flatMap((offence) => offence.Result).find((result) => result.PNCDisposalType === 2059)?.NextHearingDate ??
    undefined

  return nextHearingDate ? new Date(nextHearingDate) : undefined
}

export default getNextHearingDateFromOffences
