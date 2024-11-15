const preProcessAsn = (asn: string) => {
  let twentyCharacterAsn
  if (asn.length === 20) {
    twentyCharacterAsn = asn
  } else if (asn.length === 21) {
    twentyCharacterAsn = asn.substring(0, 2) + asn.substring(3)
  } else {
    return new Error(`Invalid ASN length. Length is ${asn.length}`)
  }

  const year = twentyCharacterAsn.substring(0, 2)
  const topLevelOrgUnit = twentyCharacterAsn.substring(2, 4)
  const middleLevelOrgUnit = twentyCharacterAsn.substring(4, 6)
  const bottomLevelOrgUnit = twentyCharacterAsn.substring(6, 8)
  const serialNumberWithoutLeadingZeroes = Number(twentyCharacterAsn.substring(8, 19)).toString()
  const checkCharacter = twentyCharacterAsn.substring(19)

  return `${year}/${topLevelOrgUnit}${middleLevelOrgUnit}/${bottomLevelOrgUnit}/${serialNumberWithoutLeadingZeroes}${checkCharacter}`
}

export default preProcessAsn
