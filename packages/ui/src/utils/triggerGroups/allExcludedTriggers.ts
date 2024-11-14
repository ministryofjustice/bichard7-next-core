import type { DisplayFullUser } from "types/display/Users"

const allExcludedTriggers = (
  currentUser: DisplayFullUser,
  forceExcludedTriggers: Record<string, string[]>
): string[] => {
  let allExcludedTriggers: string[] = []

  if (currentUser.visibleForces.length === 1) {
    const visibleForce: string = currentUser.visibleForces[0].slice(1)
    const excludedTriggersOnForce = forceExcludedTriggers[visibleForce as keyof typeof forceExcludedTriggers]
    allExcludedTriggers = [...new Set([...currentUser.excludedTriggers, ...excludedTriggersOnForce])]
  }

  return allExcludedTriggers
}

export default allExcludedTriggers
