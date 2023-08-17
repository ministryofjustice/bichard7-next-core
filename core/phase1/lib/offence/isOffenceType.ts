import { COMMON_LAWS, INDICTMENT } from "../offenceTypes"

export const isCommonLaw = (offenceCode: string): boolean => {
  const commonLawOffenceRegExp = new RegExp(`^${COMMON_LAWS}`)
  return commonLawOffenceRegExp.test(offenceCode)
}

export const isIndictment = (offenceCode: string): boolean => {
  const indictmentRegExp = new RegExp(`^${INDICTMENT}`)
  return !isCommonLaw(offenceCode) && indictmentRegExp.test(offenceCode)
}
