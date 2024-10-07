import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Amendments } from "types/Amendments"

const getValidIndex = (resultQualifierIndex: number, arrLen: number): number =>
  resultQualifierIndex > arrLen - 1 ? arrLen + 1 : resultQualifierIndex

const amendResultQualifierCode = (offences: Amendments["resultQualifierCode"], aho: AnnotatedHearingOutcome) => {
  offences?.forEach(({ resultQualifierIndex, resultIndex, offenceIndex, value }) => {
    if (!value) {
      return
    }

    const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

    if (offenceIndex === -1) {
      if (!defendant.Result) {
        throw new Error("Cannot update the ResultQualifierVariable; Result in undefined")
      }

      if (resultQualifierIndex < defendant.Result.ResultQualifierVariable.length) {
        defendant.Result.ResultQualifierVariable[resultQualifierIndex].Code = value
        return
      }

      const validIndex = getValidIndex(resultQualifierIndex, defendant.Result.ResultQualifierVariable.length)
      defendant.Result.ResultQualifierVariable = [
        { Code: value },
        ...defendant.Result.ResultQualifierVariable.slice(0, validIndex),
        ...defendant.Result.ResultQualifierVariable.slice(validIndex + 1)
      ]
      return
    }

    const offenceIndexOutOfRange = offenceIndex >= defendant.Offence.length
    if (offenceIndexOutOfRange || resultIndex === undefined) {
      throw new Error(
        `Cannot update the ResultQualifierVariable; ${
          offenceIndexOutOfRange ? "offence index is out of range" : "ResultIndex is undefined"
        }`
      )
    }

    if (resultQualifierIndex < defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable.length) {
      defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable[resultQualifierIndex].Code = value
      return
    }

    const validIndex = getValidIndex(
      resultQualifierIndex,
      defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable.length
    )

    defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable = [
      ...defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable.slice(0, validIndex),
      { Code: value },
      ...defendant.Offence[offenceIndex].Result[resultIndex].ResultQualifierVariable.slice(validIndex + 1)
    ]
  })
}

export default amendResultQualifierCode
