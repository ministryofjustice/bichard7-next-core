import {
  AnnotatedHearingOutcome,
  OrganisationUnitCodes
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ValidProperties } from "types/Amendments"

const amendDefendantOrOffenceResult = (
  offenceIndex: number,
  resultIndex: number,
  aho: AnnotatedHearingOutcome,
  propertyToAmend: ValidProperties,
  valueToAmend: OrganisationUnitCodes | Date | string
) => {
  const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  if (offenceIndex === -1) {
    if (!defendant.Result) {
      throw new Error(`Cannot update the ${propertyToAmend}; Result in undefined`)
    }
    defendant.Result = { ...defendant.Result, [propertyToAmend]: valueToAmend }
    return
  }

  const offenceIndexOutOfRange = offenceIndex > defendant.Offence.length - 1
  if (offenceIndexOutOfRange) {
    throw new Error(`Cannot update the ${propertyToAmend}; Offence index is out of range`)
  }

  const resultIndexOutOfRange = resultIndex > defendant.Offence[offenceIndex].Result.length - 1
  if (resultIndexOutOfRange) {
    throw new Error(`Cannot update ${propertyToAmend}; Result index on Offence is out of range`)
  }

  defendant.Offence[offenceIndex].Result[resultIndex] = {
    ...defendant.Offence[offenceIndex].Result[resultIndex],
    [propertyToAmend]: valueToAmend
  }
  return
}

export default amendDefendantOrOffenceResult
