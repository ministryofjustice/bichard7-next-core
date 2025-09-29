import { FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED } from "config"
import type User from "../../services/entities/User"

export const canUseTriggerAndExceptionQualityAuditing = ({ featureFlags, visibleForces }: User): boolean => {
  if (!featureFlags.useTriggerAndExceptionQualityAuditingEnabled) {
    return false
  }

  return visibleForces
    .map((force) => force.replace(/^0(\d+)/, "$1"))
    .some((force) => FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED.has(force))
}
