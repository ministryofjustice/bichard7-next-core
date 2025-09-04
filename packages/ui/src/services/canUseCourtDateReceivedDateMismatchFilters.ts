import { FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED } from "config"

export const canUseCourtDateReceivedDateMismatchFilters = (forces: string[]): boolean => {
  return forces.some((force) => FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED.has(force))
}
