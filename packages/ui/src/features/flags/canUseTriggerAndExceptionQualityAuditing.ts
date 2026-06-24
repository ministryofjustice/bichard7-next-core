import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type User from "../../services/entities/User"

export const canUseTriggerAndExceptionQualityAuditing = ({
  featureFlags,
  groups
}: Pick<User, "featureFlags" | "groups">): boolean =>
  featureFlags.useTriggerAndExceptionQualityAuditingEnabled && groups.includes(UserGroup.Supervisor)
