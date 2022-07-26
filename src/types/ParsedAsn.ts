export type ParsedAsn = {
  year: string | null
  topLevelCode?: string
  secondLevelCode: string | null
  thirdLevelCode: string | null
  bottomLevelCode: string | null
  sequenceNumber: string | null
  checkDigit: string | null
}
