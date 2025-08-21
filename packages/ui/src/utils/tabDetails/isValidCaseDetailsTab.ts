import { type CaseDetailsTab, validCaseDetailsTabs } from "../../types/CaseDetailsTab"

const validTabsSet = new Set<string>(validCaseDetailsTabs)

export const isValidCaseDetailsTab = (tab: string): tab is CaseDetailsTab => {
  return validTabsSet.has(tab)
}
