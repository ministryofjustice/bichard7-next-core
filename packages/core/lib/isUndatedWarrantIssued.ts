const undatedWarrantIssuedCodes = [4576, 4577]

const isUndatedWarrantIssued = (cjsResultCode: number) => undatedWarrantIssuedCodes.includes(cjsResultCode)

export default isUndatedWarrantIssued
