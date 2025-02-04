import type { Offence } from "../types/AnnotatedHearingOutcome"

import getRecordableOffencesForCourtCase from "./getRecordableOffencesForCourtCase"
import isResultCompatibleWithDisposal from "./isResultCompatibleWithDisposal"

const has2059Or2060Result = (offence: Offence) =>
  offence.Result.some((result) => [2059, 2060].includes(result.PNCDisposalType ?? 0))

const adjust2060ResultIfNecessary = (offences: Offence[]): Offence[] => {
  const found2059Or2060Result = offences.some(has2059Or2060Result)
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

const getAdjustedRecordableOffencesForCourtCase = (offences: Offence[], courtCaseReferenceNumber?: string) => {
  const recordableOffences = getRecordableOffencesForCourtCase(offences, courtCaseReferenceNumber)

  return adjust2060ResultIfNecessary(recordableOffences)
}

export default getAdjustedRecordableOffencesForCourtCase
