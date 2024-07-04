import type { HearingOutcome, Result } from "../../types/AnnotatedHearingOutcome"

const noCjsResultCode = 1000
const aintResultRegex = /Hearing on .*? confirmed\./s

const isPncDisposalTypeValid = (result: Result) =>
  result.PNCDisposalType !== undefined && result.PNCDisposalType === noCjsResultCode

const isAintResult = (result: Result) => result.ResultVariableText && aintResultRegex.test(result.ResultVariableText)

const isAintCase = (ho: HearingOutcome) => {
  const offencesNotAddedByCourt = ho.Case.HearingDefendant.Offence.filter((offence) => !offence.AddedByTheCourt)
  const areAllPncDisposalTypesValid = offencesNotAddedByCourt.every((offence) =>
    offence.Result.every(isPncDisposalTypeValid)
  )
  const hasAintResult = offencesNotAddedByCourt.some((offence) => offence.Result.some(isAintResult))

  return areAllPncDisposalTypesValid && hasAintResult
}

export default isAintCase
