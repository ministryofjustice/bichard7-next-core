const warrantIssuedCodes = [[4575, 4577]]

const isWarrantIssued = (cjsResultCode?: number) =>
  cjsResultCode && warrantIssuedCodes.some((range) => cjsResultCode >= range[0] && cjsResultCode <= range[1])

export default isWarrantIssued
