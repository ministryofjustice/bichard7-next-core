export const validCaseDetailsTabs = ["Defendant", "Hearing", "Case", "Offences", "Notes"] as const

export type CaseDetailsTab = (typeof validCaseDetailsTabs)[number]
