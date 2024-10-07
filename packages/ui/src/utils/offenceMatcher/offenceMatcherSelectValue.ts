const offenceMatcherSelectValue = (
  offenceReasonSequence: number | string,
  offenceCourtCaseReferenceNumber?: string
): string => {
  if (offenceCourtCaseReferenceNumber === undefined || offenceCourtCaseReferenceNumber === "") {
    return `${offenceReasonSequence}`
  }

  return `${offenceReasonSequence}-${offenceCourtCaseReferenceNumber}`
}

export default offenceMatcherSelectValue
