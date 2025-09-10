import { FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED } from "config"
import type User from "../../services/entities/User"

export const canUseCourtDateReceivedDateMismatchFilters = ({ featureFlags, visibleForces }: User): boolean => {
  if (!featureFlags.useCourtDateReceivedDateMismatchFiltersEnabled) {
    return false
  }

  return visibleForces.some((force) => FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED.has(force))
}
