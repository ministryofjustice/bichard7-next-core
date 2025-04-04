import isEqual from "lodash.isequal"

import type { Offence, Result } from "../../../../types/AnnotatedHearingOutcome"

import nonRecordableResultCodes from "../../../../lib/offences/nonRecordableResultCodes"

const disposalTextResultCodes = [1100, 3008, 3025, 3041, 3106, 3047]

const resultIsNonRecordable = (result: Result): boolean =>
  !!result.CJSresultCode && nonRecordableResultCodes.includes(result.CJSresultCode)

const resultIsRecordable = (result: Result): boolean => !resultIsNonRecordable(result)

type ResultKey = keyof Result

const compareTwoResults = (result1: Result, result2: Result, includeResultText: boolean): boolean => {
  const ignoredKeys = includeResultText ? ["PNCAdjudicationExists"] : ["PNCAdjudicationExists", "ResultVariableText"]

  const result1Keys = Object.keys(result1).filter((key) => !ignoredKeys.includes(key)) as ResultKey[]
  const result2Keys = Object.keys(result2).filter((key) => !ignoredKeys.includes(key)) as ResultKey[]

  if (!isEqual(result1Keys, result2Keys)) {
    return false
  }

  return result1Keys.every((key) => isEqual(result1[key], result2[key]))
}

const resultHasDisposalTextResultCode = (result: Result): boolean =>
  !!result.CJSresultCode && disposalTextResultCodes.includes(result.CJSresultCode)

const resultHasUserAmendedText = (result: Result): boolean =>
  !!result.ResultVariableText && result.ResultVariableText.startsWith("**")

const offencesHaveEqualResults = (offences: Offence[]): boolean => {
  if (offences.length < 2) {
    return true
  }

  let offence1 = offences[0]
  return offences.slice(1).every((offence2) => {
    const results1 = offence1.Result.filter(resultIsRecordable)
    const results2 = offence2.Result.filter(resultIsRecordable)

    if (results1.length !== results2.length) {
      return false
    }

    const result2Matched: boolean[] = new Array(results2.length).fill(false)

    results1.forEach((result1) => {
      let resultMatchFound = false

      results2.forEach((result2, j) => {
        if (resultMatchFound) {
          return
        }

        if (!result2Matched[j]) {
          const includeResultText =
            resultHasDisposalTextResultCode(result1) ||
            resultHasUserAmendedText(result1) ||
            resultHasUserAmendedText(result2)
          resultMatchFound = compareTwoResults(result1, result2, includeResultText)
        }

        if (resultMatchFound) {
          result2Matched[j] = resultMatchFound
        }
      })
    })

    offence1 = offence2

    return result2Matched.every((x) => x)
  })
}

export default offencesHaveEqualResults
