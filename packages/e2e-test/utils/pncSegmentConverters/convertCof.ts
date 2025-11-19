export const convertCof = (cofValue: string) => {
  const slice = (start: number, end: number) => cofValue.substring(start, end).trim()

  return {
    intfcUpdateType: slice(0, 1),
    referenceNumber: slice(1, 4),
    offenceQualifier1: slice(4, 6),
    offenceQualifier2: slice(6, 8),
    acpoOffenceCode: slice(8, 21),
    cjsOffenceCode: slice(21, 29),
    offenceStartDate: slice(29, 37),
    offenceStartTime: slice(37, 41),
    offenceEndDate: slice(41, 49),
    offenceEndTime: slice(49, 53)
  }
}
