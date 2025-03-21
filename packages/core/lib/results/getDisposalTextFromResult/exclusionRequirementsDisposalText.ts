// regex matches "NOT ENTER X THIS EXCLUSION LASTS FOR" or "NOT TO ENTER X THIS EXCLUSION LASTS FOR" and ignores line breaks

const REGEX = /NOT\s+(TO\s+)?ENTER(?<location>.*?)THIS\s+EXCLUSION\s+REQUIREMENT\s+LASTS\s+FOR/gs

const nestedREGEX = /NOT\s+(TO\s+)?ENTER\s(?<nestedLocation>[\s\S]*)/g

const exclusionRequirementsDisposalText = (resultVariableText: string): string => {
  const locations: string[] = []

  const matches = resultVariableText.matchAll(REGEX)

  for (const match of matches) {
    if (match?.groups?.location) {
      let nestedMatchFound = false
      const nestedMatches = match.groups.location.matchAll(nestedREGEX)
      for (const nestedMatch of nestedMatches) {
        if (nestedMatch?.groups?.nestedLocation) {
          // TODO: Once we've stopped doing comparisons, we can revert back to remove multiple spaces (see PR https://github.com/ministryofjustice/bichard7-next-core/pull/842).
          locations.push(nestedMatch.groups.nestedLocation.replace(/[\r\n\t\f]+/g, " ").trim())
          nestedMatchFound = true
        }
      }

      if (!nestedMatchFound) {
        locations.push(match.groups.location.replace(/[\r\n\t\f]+/g, " ").trim())
      }
    }
  }

  if (locations.length) {
    const longestLocation = locations.reduce((a, b) => (a.length > b.length ? a : b), "")

    return `EXCLUDED FROM ${longestLocation}`
  }

  return ""
}

export default exclusionRequirementsDisposalText
