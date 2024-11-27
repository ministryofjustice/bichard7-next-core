import isRecordableOffence from "../phase2/lib/isRecordableOffence"
import type { Offence } from "../types/AnnotatedHearingOutcome"
import isResultCompatibleWithDisposal from "../phase2/lib/isResultCompatibleWithDisposal"

const has2059Or2060Result = (offence: Offence) =>
  offence.Result.some((result) => [2059, 2060].includes(result.PNCDisposalType ?? 0))

const adjust2060ResultIfNecessary = (offences: Offence[]): Offence[] => {
  const found2059Or2060Result = offences.some((offence) => has2059Or2060Result(offence))
  const foundNon2059Or2060Offence = offences.some(
    (offence) => (!offence.AddedByTheCourt || isResultCompatibleWithDisposal(offence)) && !has2059Or2060Result(offence)
  )

  if (!found2059Or2060Result || foundNon2059Or2060Offence) {
    return offences
  }

  return offences.map((offence) => ({
    ...offence,
    Result: offence.Result.map((result) => ({
      ...result,
      PNCDisposalType: result.PNCDisposalType === 2060 ? 2063 : result.PNCDisposalType
    }))
  }))
}

export const getAdjustedRecordableOffencesForCourtCase = (offences: Offence[], courtCaseReferenceNumber?: string) => {
  const recordableOffences = getRecordableOffencesForCourtCase(offences, courtCaseReferenceNumber)

  return adjust2060ResultIfNecessary(recordableOffences)
}

const getRecordableOffencesForCourtCase = (offences: Offence[], courtCaseReferenceNumber?: string) =>
  offences.filter(
    (offence) =>
      isRecordableOffence(offence) &&
      (!offence.CourtCaseReferenceNumber || offence.CourtCaseReferenceNumber === courtCaseReferenceNumber)
  )

export default getRecordableOffencesForCourtCase
