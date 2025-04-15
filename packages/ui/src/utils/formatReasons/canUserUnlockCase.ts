import Permission from "@moj-bichard7/common/types/Permission"
import type { DisplayFullUser } from "types/display/Users"

export const canUserUnlockCase = (user: DisplayFullUser, lockedUsername?: string | null): boolean => {
  return user.hasAccessTo[Permission.UnlockOtherUsersCases] || user.username === lockedUsername
}
