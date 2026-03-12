export type Ccr = {
  courtCaseReferenceNumber: string
  crimeOffenceReferenceNumber: string
}

const convertCcr = (ccrValue: string): Ccr => {
  const slice = (start: number, end: number) => ccrValue.substring(start, end).trim()

  const convertedCourtCaseReference = slice(1, 16)
    .split("/")
    .map((part, index) => (index === 2 ? part.padStart(7, "0") : part))
    .join("/")

  return {
    courtCaseReferenceNumber: convertedCourtCaseReference,
    crimeOffenceReferenceNumber: slice(16, 31)
  }
}

export default convertCcr
