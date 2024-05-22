// regex matchs "DEFENDANT X THIS EXCLUSION LASTS" and ignores line breaks
const REGEX = /DEFENDANT\s+EXCLUDED\s+FROM(?<location1>[\s\S]*?)THIS\s+EXCLUSION\s+REQUIREMENT\s+LASTS\s+FOR/g

const licencedPremisesExclusionOrderDisposalText = (resultVariableText: string): string => {
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

export default licencedPremisesExclusionOrderDisposalText
