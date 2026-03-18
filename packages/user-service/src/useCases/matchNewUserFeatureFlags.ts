import type FeatureFlags from "types/FeatureFlags"

export default (currentUserFeatureFlags?: FeatureFlags): FeatureFlags => {
  const newUserFeatureFlags: FeatureFlags = { httpsRedirect: true, exceptionsEnabled: false }

  if (currentUserFeatureFlags?.onlyAccessToNewBichard) {
    newUserFeatureFlags.onlyAccessToNewBichard = currentUserFeatureFlags.onlyAccessToNewBichard
  }

  return newUserFeatureFlags
}
