import Asn from "services/Asn"

const isAsnFormatValid = (asn: string): boolean => {
  const asnString = asn?.replace(/\//g, "")
  const year = `\\d{2}`
  const forceAndUnit = `[A-Z0-9]{6,7}`
  const sequence = `\\d{1,11}`
  const checkLetterRegex = `[A-HJ-NP-RT-Z]{1}`
  const validFormat = new RegExp(`^${year}${forceAndUnit}${sequence}${checkLetterRegex}$`).test(asnString)
  const validCheckDigit = new Asn(asnString).checkCharacter() === asnString?.slice(-1)
  return validFormat && validCheckDigit
}

export default isAsnFormatValid
