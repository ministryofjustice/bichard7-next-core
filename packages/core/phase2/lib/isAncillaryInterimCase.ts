import type { HearingOutcome, Result } from "../../types/AnnotatedHearingOutcome"

const noCjsResultCode = 1000
const ancillaryInterimResultRegex = /Hearing on .*? confirmed\./s

const isPncDisposalTypeValid = (result: Result) =>
  result.PNCDisposalType !== undefined && result.PNCDisposalType === noCjsResultCode

const isAncillaryInterimResult = (result: Result) =>
  result.ResultVariableText && ancillaryInterimResultRegex.test(result.ResultVariableText)

const isAncillaryInterimCase = (ho: HearingOutcome) => {
  const offencesNotAddedByCourt = ho.Case.HearingDefendant.Offence.filter((offence) => !offence.AddedByTheCourt)
  const areAllPncDisposalTypesValid = offencesNotAddedByCourt.every((offence) =>
    offence.Result.every(isPncDisposalTypeValid)
  )
  const hasAncillaryInterimResult = offencesNotAddedByCourt.some((offence) =>
    offence.Result.some(isAncillaryInterimResult)
  )

  return areAllPncDisposalTypesValid && hasAncillaryInterimResult
}

export default isAncillaryInterimCase
