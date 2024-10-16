import type { DisplayFullUser } from "types/display/Users"

const isEnabled = (user: DisplayFullUser): boolean => {
  const enabledInProduction = true // change this if we need to disable in production for everyone
  const { exceptionsEnabled, offenceMatchingEnabled } = user.featureFlags
  const featureFlagsEnabled: boolean = (exceptionsEnabled ?? false) && (offenceMatchingEnabled ?? false)

  const isProduction = process.env.WORKSPACE === "production"
  if (!isProduction) {
    return featureFlagsEnabled
  }

  return enabledInProduction && featureFlagsEnabled
}

export default isEnabled
