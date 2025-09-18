import { FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED } from "config"
import type User from "../../services/entities/User"

export const canUseTriggerAndExceptionQualityAuditing = ({ featureFlags, visibleForces }: User): boolean => {
  if (!featureFlags.useTriggerAndExceptionQualityAuditingEnabled) {
    return false
  }

  return visibleForces.some((force) => FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED.has(force))
}
