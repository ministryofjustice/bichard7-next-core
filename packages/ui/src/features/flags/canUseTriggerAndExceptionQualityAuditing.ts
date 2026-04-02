import { FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED } from "config"
import type User from "../../services/entities/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { forcesWithEnvVariable } from "utils/forceNormalisation"

export const canUseTriggerAndExceptionQualityAuditing = ({ featureFlags, visibleForces, groups }: User): boolean => {
  if (!featureFlags.useTriggerAndExceptionQualityAuditingEnabled) {
    return false
  }

  if (!groups.includes(UserGroup.Supervisor)) {
    return false
  }

  return forcesWithEnvVariable(FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED, visibleForces)
}
