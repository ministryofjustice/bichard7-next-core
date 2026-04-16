import type User from "../../services/entities/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

export const canUseTriggerAndExceptionQualityAuditing = ({ featureFlags, groups }: User): boolean =>
  featureFlags.useTriggerAndExceptionQualityAuditingEnabled && groups.includes(UserGroup.Supervisor)
