import { FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED } from "config"
import type User from "../../services/entities/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

export const canUseTriggerAndExceptionQualityAuditing = ({ featureFlags, visibleForces, groups }: User): boolean => {
  if (!featureFlags.useTriggerAndExceptionQualityAuditingEnabled) {
    return false
  }

  if (!groups.includes(UserGroup.Supervisor)) {
    return false
  }

  return visibleForces
    .map((force) => force.replace(/^0(\d+)/, "$1"))
    .some((force) => FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED.has(force))
}
