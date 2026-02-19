const convertLongAsnToLedsFormat = (asn: string): string => {
  const year = asn.slice(0, 2)
  const force = asn.slice(2, 4)
  const unit = asn.slice(4, 6)
  const system = asn.slice(6, 8)
  const sequenceAndCheckCharacter = asn.slice(8)

  return `${year}/${force}${unit}/${system}/${sequenceAndCheckCharacter}`.toUpperCase()
}

export default convertLongAsnToLedsFormat
