const validTabsArray = ["Defendant", "Hearing", "Case", "Offences", "Notes"] as const

type CaseDetailsTab = (typeof validTabsArray)[number]

const validTabsSet = new Set<string>(validTabsArray)

export const isValidCaseDetailsTab = (tab: string): tab is CaseDetailsTab => {
  return validTabsSet.has(tab)
}

export default CaseDetailsTab
