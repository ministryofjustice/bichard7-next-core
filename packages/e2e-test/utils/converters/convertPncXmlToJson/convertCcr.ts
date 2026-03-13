export type Ccr = {
  courtCaseReferenceNumber: string
  crimeOffenceReferenceNumber: string
}

const formatCourtCaseReference = (courtCaseReference: string) =>
  courtCaseReference
    .split("/")
    .map((part, index) => (index === 2 ? part.padStart(7, "0") : part))
    .join("/")

const convertCcr = (ccrValue: string): Ccr => {
  const slice = (start: number, end: number) => ccrValue.substring(start, end).trim()

  return {
    courtCaseReferenceNumber: formatCourtCaseReference(slice(1, 16)),
    crimeOffenceReferenceNumber: slice(16, 31)
  }
}

export default convertCcr
