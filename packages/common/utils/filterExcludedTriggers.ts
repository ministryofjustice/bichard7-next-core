// returns a list of excluded triggers, with any includedTriggers removed
const filterExcludedTriggers = (excludedTriggers: string[] = [], includedTriggers: string[] = []): string[] => {
  if (excludedTriggers.length === 0) {
    return []
  }

  const includedSet = new Set(includedTriggers)
  return excludedTriggers.filter((trigger) => !includedSet.has(trigger))
}

export default filterExcludedTriggers
