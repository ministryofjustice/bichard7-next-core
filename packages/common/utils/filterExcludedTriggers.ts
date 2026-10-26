import getShortTriggerCode from "./getShortTriggerCode"

// returns a list of excluded triggers, with any includedTriggers removed
const filterExcludedTriggers = (excludedTriggers: string[] = [], includedTriggers: string[] = []): string[] => {
  if (excludedTriggers.length === 0) {
    return []
  }

  const includedSet = new Set(includedTriggers)
  return excludedTriggers.filter((trigger) => {
    const shortTrigger = getShortTriggerCode(trigger) ?? ""
    return !includedSet.has(trigger) && !includedSet.has(shortTrigger)
  })
}

export default filterExcludedTriggers
