const DEFENDANT_WARRANT_ISSUED_RESULT_CODES = [4576, 4577]

const isDefendantWarrantIssuedResult = (cjsResultCode: number): boolean => {
  return DEFENDANT_WARRANT_ISSUED_RESULT_CODES.includes(cjsResultCode)
}

export default isDefendantWarrantIssuedResult
