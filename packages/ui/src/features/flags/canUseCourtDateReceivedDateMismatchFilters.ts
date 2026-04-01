import { FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED } from "config"
import type User from "../../services/entities/User"
import { forcesWithEnvVariable } from "utils/forceNormalisation"

export const canUseCourtDateReceivedDateMismatchFilters = ({ featureFlags, visibleForces }: User): boolean => {
  if (!featureFlags.useCourtDateReceivedDateMismatchFiltersEnabled) {
    return false
  }

  return forcesWithEnvVariable(FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED, visibleForces)
}
