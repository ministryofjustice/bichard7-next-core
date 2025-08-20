export const validCaseDetailsTabs = ["Defendant", "Hearing", "Case", "Offences", "Notes"] as const

type CaseDetailsTab = (typeof validCaseDetailsTabs)[number]

export default CaseDetailsTab
