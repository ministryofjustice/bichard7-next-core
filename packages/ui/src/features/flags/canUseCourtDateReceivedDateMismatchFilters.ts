import { FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED } from "config"
import type User from "../../services/entities/User"

export const canUseCourtDateReceivedDateMismatchFilters = ({ featureFlags, visibleForces }: User): boolean => {
  if (!featureFlags.useCourtDateReceivedDateMismatchFiltersEnabled) {
    return false
  }

  return visibleForces
    .map((force) => force.replace(/^0(\d+)/, "$1"))
    .some((force) => FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED.has(force))
}
