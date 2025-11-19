export const convertCcr = (ccrValue: string) => {
  const slice = (start: number, end: number) => ccrValue.substring(start, end).trim()

  return {
    updateTypeKey: slice(0, 1),
    courtCaseReferenceNumber: slice(1, 16),
    crimeOffenceReferenceNumber: slice(16, 31)
  }
}
