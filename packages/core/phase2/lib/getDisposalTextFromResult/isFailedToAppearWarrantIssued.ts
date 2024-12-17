const WARRANT_ISSUED_RESULT_CODES = [4575, 4576, 4577, 4585, 4586]

const isFailedToAppearWarrantIssued = (cjsResultCode: number): boolean => {
  return WARRANT_ISSUED_RESULT_CODES.includes(cjsResultCode)
}

export default isFailedToAppearWarrantIssued
