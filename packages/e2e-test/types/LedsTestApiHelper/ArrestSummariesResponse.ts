import type { CurrentAppearance, NextAppearance } from "@moj-bichard7/core/types/leds/RemandRequest"

export type RemandHeadline = {
  remandId: string
  appearanceResult: string
  remandDate: string
  currentAppearance: CurrentAppearance
  nextAppearance: Omit<NextAppearance, "forceStationCode">
}

type OffenceHeadline = {
  offenceId: string
  additionalOffenceMarker: boolean
  npccOffenceCode: string
  cjsOffenceCode: string
  qualifiedCjsCode: string
  startDate: string
  roleQualifier: string[]
  legislationQualifier: string[]
}

export type ArrestSummaries = {
  arrestReportHeadlines: {
    reportId: string
    asn: string
    processStage: string
    processStageDate: string
  }
  fingerprintStatusCode1: string
  offencesHeadlines: OffenceHeadline[]
  remandHeadlines: RemandHeadline[]
}

type ArrestSummariesResponse = {
  arrestSummaries: ArrestSummaries[]
}

export default ArrestSummariesResponse
