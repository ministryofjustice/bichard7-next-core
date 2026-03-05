const convertAsnToLedsFormat = (asn: string): string => {
  const rawAsn = asn.replace(/\//g, "")
  const year = rawAsn.slice(0, 2)
  const force = rawAsn.slice(2, 4)
  const unit = rawAsn.slice(4, 6)
  const system = rawAsn.slice(6, 8)
  const sequenceAndCheckCharacter = rawAsn.slice(8)

  return `${year}/${force}${unit}/${system}/${sequenceAndCheckCharacter.padStart(12, "0")}`.toUpperCase()
}

export default convertAsnToLedsFormat
