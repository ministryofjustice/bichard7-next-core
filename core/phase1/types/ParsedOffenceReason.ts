export type ParsedOffenceReason = {
  OffenceCode: string
  topLevelCode?: string
  secondLevelCode: string
  thirdLevelCode: string
  bottomLevelCode: string
  sequenceNumber: string
  checkDigit: string
}
