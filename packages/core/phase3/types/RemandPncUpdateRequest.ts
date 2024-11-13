type RemandPncUpdateRequest = {
  operation: "NEWREM"
  request: {
    pncIdentifier: string
    pncCheckName: string
    croNumber: null | string
    arrestSummonsNumber: string
    forceStationCode: string
    hearingDate: string
    nextHearingDate: string
    pncRemandStatus: string
    remandLocationCourt: string
    psaCourtCode: string
    courtNameType1: string
    courtNameType2: string
    localAuthorityCode: string
    bailConditions: []
  }
}

export default RemandPncUpdateRequest
