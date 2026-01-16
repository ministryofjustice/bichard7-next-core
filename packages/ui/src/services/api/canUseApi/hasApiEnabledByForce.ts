import { FORCES_WITH_API_ENABLED } from "config"

export const hasApiEnabledByForce = (visibleForces: string[]): boolean => {
  return visibleForces
    .map((force) => force.padStart(3, "0").substring(1))
    .some((force) => FORCES_WITH_API_ENABLED.has(force))
}
