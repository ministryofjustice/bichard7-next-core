import type { ParsedAsn } from "src/types/ParsedAsn"

const sequenceNumberLength = 11

// If ASN is only 20 chars, format excludes the 'f' and is: YYFFUUSSnnnnnnnnnnnA
// otherwise, format includes the 'f' and is: YYfFFUUSSnnnnnnnnnnnA
// where:
// YY = Year
// f  = Top Level Code (optional)
// FF = Second Level Code (Force)
// UU = Third Level Code (Unit)
// SS = Bottom Level Code
// n* = Sequence number (ID)
// A  = Check character

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
    sequenceNumber: asn.substring(8 + offset, 8 + offset + sequenceNumberLength).toUpperCase(),
    checkDigit: asn.substring(8 + offset + sequenceNumberLength, 8 + offset + sequenceNumberLength + 1).toUpperCase()
  }
}

export default parseAsn
