import type { HearingOutcome, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const noCjsResultCode = 1000
const ancillaryInterimResultRegex = /Hearing on .*? confirmed\./s

const isPoliceDisposalTypeValid = (result: Result) =>
  result.PNCDisposalType !== undefined && result.PNCDisposalType === noCjsResultCode

const isAncillaryInterimResult = (result: Result) =>
  result.ResultVariableText && ancillaryInterimResultRegex.test(result.ResultVariableText)

const isAncillaryInterimCase = (ho: HearingOutcome) => {
  const offencesNotAddedByCourt = ho.Case.HearingDefendant.Offence.filter((offence) => !offence.AddedByTheCourt)
  const areAllPoliceDisposalTypesValid = offencesNotAddedByCourt.every((offence) =>
    offence.Result.every(isPoliceDisposalTypeValid)
  )
  const hasAncillaryInterimResult = offencesNotAddedByCourt.some((offence) =>
    offence.Result.some(isAncillaryInterimResult)
  )

  return areAllPoliceDisposalTypesValid && hasAncillaryInterimResult
}

export default isAncillaryInterimCase
