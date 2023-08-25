import type { ParsedAsn } from "../../../types/ParsedAsn"

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

  const sequenceNumber =
    asn.length >= 8 + offset + sequenceNumberLength
      ? asn.substring(8 + offset, 8 + offset + sequenceNumberLength).toUpperCase()
      : null

  const checkDigit =
    asn.length >= 8 + offset + sequenceNumberLength + 1
      ? asn.substring(8 + offset + sequenceNumberLength, 8 + offset + sequenceNumberLength + 1).toUpperCase()
      : null

  const validLength = asn.length >= 8 + offset
  return {
    year: asn.length >= 2 ? asn.substring(0, 2) : null,
    topLevelCode, // if 21 chars long it will include the third char as topLevelCode
    secondLevelCode: validLength ? asn.substring(2 + offset, 4 + offset).toUpperCase() : null,
    thirdLevelCode: validLength ? asn.substring(4 + offset, 6 + offset).toUpperCase() : null,
    bottomLevelCode: validLength ? asn.substring(6 + offset, 8 + offset).toUpperCase() : null,
    sequenceNumber,
    checkDigit
  }
}

export default parseAsn
