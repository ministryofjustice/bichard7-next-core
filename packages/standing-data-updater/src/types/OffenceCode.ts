export type OffenceCode = {
  cjsCode: string
  description?: string
  homeOfficeClassification?: string | null
  notifiableToHo?: boolean | null
  offenceCategory?: string
  offenceTitle?: string
  recordableOnPnc?: boolean | null
}
