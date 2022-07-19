export type ParsedAsn = {
  year: string
  topLevelCode?: string
  secondLevelCode: string
  thirdLevelCode: string
  bottomLevelCode: string
  sequenceNumber: string | null
  checkDigit: string | null
}
