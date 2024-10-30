export const driverDisqualificationCodes = [3070, 3071, 3072, 3094, 3096]

const isDriverDisqualificationResult = (pncDisposalType: number | undefined): boolean =>
  !!pncDisposalType && driverDisqualificationCodes.includes(pncDisposalType)

export default isDriverDisqualificationResult
