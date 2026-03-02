import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { CJS_CODES, QUALIFIER_CODES } from "../warrantConfiguration"

interface ResultAnalysis {
  bail: boolean
  firstInstance: boolean
  noBail: boolean
  parentResult: boolean
  warrantResultText?: string
  withdrawnResultText?: string
  witnessResult: boolean
}

export const analyzeResult = (result: Result): ResultAnalysis => {
  const cjsCode = result.CJSresultCode

  // Check CJS Codes against configuration
  const parentResult = CJS_CODES.PARENT.includes(cjsCode)
  const witnessResult = CJS_CODES.WITNESS.includes(cjsCode)
  const bail = CJS_CODES.BAIL.includes(cjsCode)
  const noBail = CJS_CODES.NO_BAIL.includes(cjsCode)
  const withdrawn = CJS_CODES.WITHDRAWN.includes(cjsCode)

  // Check Result Qualifier Variable for First Instance ("LE")
  let firstInstance = false
  if (result.ResultQualifierVariable) {
    firstInstance = result.ResultQualifierVariable.some((q) => QUALIFIER_CODES.FIRST_INSTANCE.includes(q.Code))
  }

  // Extract Text Logic
  let warrantResultText: string | undefined
  let withdrawnResultText: string | undefined

  // Extract Warrant Text if it is one of the warrant types
  if ((parentResult || witnessResult || bail || noBail) && result.ResultVariableText) {
    warrantResultText = result.ResultVariableText
  }

  // Extract Withdrawn Text
  if (withdrawn && result.ResultVariableText) {
    withdrawnResultText = result.ResultVariableText
  }

  return {
    bail,
    firstInstance,
    noBail,
    parentResult,
    warrantResultText,
    withdrawnResultText,
    witnessResult
  }
}
