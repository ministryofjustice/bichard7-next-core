import type { ParsedAsn } from "src/types/ParsedAsn"

const parseAsn = (asn: string): ParsedAsn => {
  let offset = 0
  let topLevelCode
  if (asn.length === 21) {
    topLevelCode = asn.substring(2, 3).toUpperCase()
    offset = 1
  }

  return {
    year: asn.substring(0, 2),
    topLevelCode, // if 21 chars long it will include the third char as topLevelCode
    secondLevelCode: asn.substring(2 + offset, 4 + offset).toUpperCase(),
    thirdLevelCode: asn.substring(4 + offset, 6 + offset).toUpperCase(),
    bottomLevelCode: asn.substring(6 + offset, 8 + offset).toUpperCase(),
    sequenceNumber: asn.substring(8 + offset, asn.length - 1).toUpperCase(),
    checkDigit: asn.slice(-1)
  }
}

export default parseAsn
