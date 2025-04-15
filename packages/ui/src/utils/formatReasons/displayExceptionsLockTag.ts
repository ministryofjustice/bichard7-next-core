import type { DisplayFullUser } from "types/display/Users"
import { canUserUnlockCase } from "./canUserUnlockCase"

export const canUnlockCase = (user: DisplayFullUser, errorLockedByUsername: string | null | undefined): boolean => {
  return !!errorLockedByUsername && canUserUnlockCase(user, errorLockedByUsername)
}
