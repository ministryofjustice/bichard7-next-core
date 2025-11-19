export const convertCcr = (ccrXml: string) => {
  const slice = (start: number, end: number) => ccrXml.substring(start, end).trim()

  return {
    updateTypeKey: slice(0, 1),
    courtCaseReferenceNumber: slice(1, 16),
    crimeOffenceReferenceNumber: slice(16, 31)
  }
}
