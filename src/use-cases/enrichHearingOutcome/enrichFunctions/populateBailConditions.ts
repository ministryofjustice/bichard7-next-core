import type { Result, ResultQualifierVariable } from "src/types/AnnotatedHearingOutcome"
import { lookupResultQualifierCodeByCjsCode } from "src/use-cases/dataLookup"

const resultQualifierIsBailCondition = (qualifier: ResultQualifierVariable): boolean =>
  qualifier.Code >= "JD" && qualifier.Code <= "JZ"

const populateBailConditions = (result: Result): void => {
  const qualifiers = result.ResultQualifierVariable
  if (!result.BailCondition) {
    result.BailCondition = []
  }
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
