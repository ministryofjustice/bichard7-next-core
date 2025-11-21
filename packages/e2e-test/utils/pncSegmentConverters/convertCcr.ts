export type Ccr = {
  courtCaseReferenceNumber: string
  crimeOffenceReferenceNumber: string
}

const convertCcr = (ccrValue: string): Ccr => {
  const slice = (start: number, end: number) => ccrValue.substring(start, end).trim()

  return {
    courtCaseReferenceNumber: slice(1, 16),
    crimeOffenceReferenceNumber: slice(16, 31)
  }
}

export default convertCcr
