type resultDetails = {
  resultCode: number
  resultText: string
  disposalEffectiveDate?: string
}

type OffenceDetails = {
  offenceId?: string
  ownerCode: string
  startDate: string
  startTime?: string
  endDate?: string
  endTime?: string
  offenceLocation: string
  offenceCode: string
  convictionDate: string
  verdict: string
  plea: string
  results: resultDetails[]
}

export type NonEmptyOffenceDetailsArray = [OffenceDetails, ...OffenceDetails[]]

export default OffenceDetails
