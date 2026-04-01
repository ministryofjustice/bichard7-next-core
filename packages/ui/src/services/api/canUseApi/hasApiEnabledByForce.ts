import { FORCES_WITH_API_ENABLED } from "config"
import { forcesWithEnvVariable } from "utils/forceNormalisation"

export const hasApiEnabledByForce = (visibleForces: string[]): boolean =>
  forcesWithEnvVariable(FORCES_WITH_API_ENABLED, visibleForces)
