import type User from "../services/entities/User"

const checkUseCourtDateReceivedDateMismatchFiltersEnabled = (user: User): boolean => {
  return user.featureFlags.useCourtDateReceivedDateMismatchFiltersEnabled
}

export default checkUseCourtDateReceivedDateMismatchFiltersEnabled
