type RemandPncUpdateRequest = {
  operation: "NEWREM"
  request: {
    pncIdentifier: string | null
    pncCheckName: string | null
    croNumber: string | null
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
    bailConditions: string[]
  }
}

export default RemandPncUpdateRequest
