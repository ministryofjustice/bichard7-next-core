type CaseDetailsTab = "Defendant" | "Hearing" | "Case" | "Offences" | "Notes"

const validTabsArray: CaseDetailsTab[] = ["Defendant", "Hearing", "Case", "Offences", "Notes"]

export const isValidCaseDetailsTabArray = (tab: string): tab is CaseDetailsTab => {
  return (validTabsArray as string[]).includes(tab)
}

export default CaseDetailsTab
