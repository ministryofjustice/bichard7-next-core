type OffenceDetails = {
  ownerCode: string
  startDate: string
  startTime?: string
  endDate?: string
  endTime?: string
  offenceLocation: string
  offenceCode: string
}

export type NonEmptyOffenceDetailsArray = [OffenceDetails, ...OffenceDetails[]]

export default OffenceDetails
