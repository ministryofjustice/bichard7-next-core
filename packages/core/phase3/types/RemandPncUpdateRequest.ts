import type { PncOperation } from "@moj-bichard7/common/types/PncOperation"

type RemandPncUpdateRequest = {
  operation: PncOperation.REMAND
  personId?: string
  reportId?: string
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
