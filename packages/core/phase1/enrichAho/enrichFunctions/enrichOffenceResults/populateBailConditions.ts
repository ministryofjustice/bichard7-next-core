import { lookupResultQualifierCodeByCjsCode } from "../../../../lib/dataLookup"
import type { Result, ResultQualifierVariable } from "../../../../types/AnnotatedHearingOutcome"

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
