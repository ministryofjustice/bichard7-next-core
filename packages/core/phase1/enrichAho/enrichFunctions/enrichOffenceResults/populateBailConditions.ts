import type { Result, ResultQualifierVariable } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { lookupResultQualifierCodeByCjsCode } from "@moj-bichard7/common/aho/dataLookup/index"

const resultQualifierIsBailCondition = (qualifier: ResultQualifierVariable): boolean =>
  qualifier.Code >= "JD" && qualifier.Code <= "JZ"

const populateBailConditions = (result: Result): void => {
  const qualifiers = result.ResultQualifierVariable
  result.BailCondition = []

  qualifiers.filter(resultQualifierIsBailCondition).forEach((qualifier) => {
    if (qualifier.Code) {
      const description = lookupResultQualifierCodeByCjsCode(qualifier.Code)?.description
      if (description) {
        result.BailCondition?.push(description)
      }
    }
  })
}

export default populateBailConditions
