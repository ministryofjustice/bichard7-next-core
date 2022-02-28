import type { Plea } from "src/types/Plea"

const lookupRemandStatusBySpiCode = (spiCode: string): any => {
  console.log(spiCode)
  return spiCode
}

const lookupPleaStatusBySpiCode = (plea: Plea): any => {
  console.log(plea)
  return plea
}

const lookupVerdictBySpiCode = (spiCode: string): any => {
  console.log(spiCode)
  return spiCode
}

const lookupModeOfTrialReasonBySpiCode = (spiCode: string): any => {
  console.log(spiCode)
  return spiCode
}

const lookupPSACodeByCrownCourtName = (courtName: string): string | undefined => {
  console.log(courtName)
  return courtName
}

const lookupResultQualifierCodeByCjsCode = (cjsCode: string): any => {
  console.log(cjsCode)
  return cjsCode
}

export {
  lookupRemandStatusBySpiCode,
  lookupPleaStatusBySpiCode,
  lookupVerdictBySpiCode,
  lookupModeOfTrialReasonBySpiCode,
  lookupPSACodeByCrownCourtName,
  lookupResultQualifierCodeByCjsCode
}
