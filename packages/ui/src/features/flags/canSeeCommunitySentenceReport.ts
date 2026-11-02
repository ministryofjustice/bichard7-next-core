import type { User } from "@moj-bichard7/common/types/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

export const canSeeCommunitySentenceReport = ({
  featureFlags,
  groups
}: Pick<User, "featureFlags" | "groups">): boolean =>
  featureFlags.communitySentenceReportEnabled && groups.includes(UserGroup.Supervisor)
