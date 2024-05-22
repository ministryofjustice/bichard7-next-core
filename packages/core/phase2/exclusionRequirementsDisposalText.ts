// regex matchs "NOT ENTER X THIS EXCLUSION LASTS" or "NOT TO ENTER X THIS EXCLUSION LASTS" and ignores line breaks
const REGEX =
  /NOT\s+TO\s+ENTER(?<location1>[\s\S]*?)THIS\s+EXCLUSION\s+REQUIREMENT\s+LASTS\s+FOR|NOT\s+ENTER(?<location2>[\s\S]*?)THIS\s+EXCLUSION\s+REQUIREMENT\s+LASTS\s+FOR/g

const exclusionRequirementsDisposalText = (resultVariableText: string): string => {
  let match: RegExpExecArray | null

  const locations: string[] = []

  while ((match = REGEX.exec(resultVariableText)) !== null) {
    if (match.groups) {
      Object.values(match.groups).forEach(
        (location) => location && locations.push(location.replace(/\s+/g, " ").trim())
      )
    }
  }

  if (locations.length) {
    const longestLoaction = locations.reduce((a, b) => (a.length > b.length ? a : b))

    return `EXCLUDED FROM ${longestLoaction}`
  }

  return ""
}

export default exclusionRequirementsDisposalText
