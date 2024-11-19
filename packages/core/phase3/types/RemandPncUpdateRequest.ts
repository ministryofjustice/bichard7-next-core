type RemandPncUpdateRequest = {
  operation: "NEWREM"
  request: {
    arrestSummonsNumber: string
    bailConditions: string[]
    courtNameType1: string
    courtNameType2: string
    croNumber: null | string
    forceStationCode: string
    hearingDate: string
    localAuthorityCode: string
    nextHearingDate: string
    pncCheckName: null | string
    pncIdentifier: null | string
    pncRemandStatus: string
    psaCourtCode: string
    remandLocationCourt: string
  }
}

export default RemandPncUpdateRequest