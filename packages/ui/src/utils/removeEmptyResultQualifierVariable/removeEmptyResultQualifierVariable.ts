import {
  AnnotatedHearingOutcome,
  ResultQualifierVariable
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

const removeEmptyResultQualifierVariableFn = (resultArray: ResultQualifierVariable[]): ResultQualifierVariable[] =>
  resultArray.filter((result) => result.Code || result.Code.length > 0)

const removeEmptyResultQualifierVariable = (aho: AnnotatedHearingOutcome) => {
  const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  if (defendant.Result) {
    defendant.Result.ResultQualifierVariable = removeEmptyResultQualifierVariableFn(
      defendant.Result.ResultQualifierVariable
    )
  }

  // remove empty result qualifier variables from offence results
  defendant.Offence.forEach((offence, offenceIdx) =>
    offence.Result.forEach(
      (result, resultIdx) =>
        (defendant.Offence[offenceIdx].Result[resultIdx].ResultQualifierVariable = removeEmptyResultQualifierVariableFn(
          result.ResultQualifierVariable
        ))
    )
  )
}

export default removeEmptyResultQualifierVariable
