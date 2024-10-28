import type { Result, ResultQualifierVariable } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

export const dummyResultQualifierVariable = [{ Code: "00XX" }] as ResultQualifierVariable[]

const createDummyResult = (): Result =>
  ({ CJSresultCode: 999, ResultQualifierVariable: dummyResultQualifierVariable }) as Result

export default createDummyResult
