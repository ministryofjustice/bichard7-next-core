type Pagination = {
  recordTotal: number
  offset: number
  limit: number
}

export type ArrestSummaryOffence = {
  offenceId: string
  offenceStartDate: string
  offenceDescription: string[]
  version: string
}

type ArrestSummary = {
  asn: string
  processStageDate: string
  offences: ArrestSummaryOffence[]
}

type ArrestSummonsResponse = {
  pagination: Pagination
  arrestSummaries: ArrestSummary[]
}

export default ArrestSummonsResponse
