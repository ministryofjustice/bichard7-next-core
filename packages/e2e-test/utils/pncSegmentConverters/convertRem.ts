export type Rem = {
  updateType: string
  remandDate: string
  remandResult: string
  remandLocationFfss: string
  remandLocationCourt: string
  courtNameType1: string
  nextAppearanceDate: string
  nextAppearanceLocation: string
  courtNameType2: string
  bailConditions: string
  bailAddress: string
  breachOfBailConditions: string
  custodyForceStationCode: string
  institutionCode: string
  prisonerNumber: string
  custodyText: string
  nextAppearanceLocationFfss: string
  localAuthorityCode: string
  localAuthorityName: string
  localAuthoritySecureUnitMarker: string
  socialWorkerName: string
  socialWorkerTelephone: string
}

const convertRem = (remValue: string): Rem => {
  let currentIndex = 0
  const read = (length: number) => {
    const value = remValue.substring(currentIndex, currentIndex + length)
    currentIndex += length

    return value.trim()
  }

  return {
    updateType: read(1),
    remandDate: read(8),
    remandResult: read(1),
    remandLocationFfss: read(4), // Unused
    remandLocationCourt: read(4),
    courtNameType1: read(71),
    nextAppearanceDate: read(8),
    nextAppearanceLocation: read(4),
    courtNameType2: read(71),
    bailConditions: read(4000),
    bailAddress: read(167), // Unused
    breachOfBailConditions: read(166), // Unused
    custodyForceStationCode: read(4), // Unused
    institutionCode: read(4), // Unused
    prisonerNumber: read(6), // Unused
    custodyText: read(256), // Unused
    nextAppearanceLocationFfss: read(4), // Unused
    localAuthorityCode: read(4),
    localAuthorityName: read(70), // Unused
    localAuthoritySecureUnitMarker: read(1), // Unused
    socialWorkerName: read(54), // Unused
    socialWorkerTelephone: read(49) // Unused
  }
}

export default convertRem
