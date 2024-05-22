const WARRANT_ISSUED_RESULT_CODES = [4575, 4576, 4577, 4585, 4586]
const WARRANT_ISSUED_RESULT_QUALIFIER = "EO"

const isFailedToAppearWarrantIssued = (cjsResultCode: number, qualifiers: string[]): boolean => {
  return WARRANT_ISSUED_RESULT_CODES.includes(cjsResultCode) && !qualifiers.includes(WARRANT_ISSUED_RESULT_QUALIFIER)
}

export default isFailedToAppearWarrantIssued
