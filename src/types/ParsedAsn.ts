export type ParsedAsn = {
  year: string | null
  topLevelCode?: string
  secondLevelCode: string
  thirdLevelCode: string
  bottomLevelCode: string
  sequenceNumber: string | null
  checkDigit: string | null
}
