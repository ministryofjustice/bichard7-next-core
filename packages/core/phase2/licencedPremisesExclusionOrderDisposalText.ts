// regex matchs "DEFENDANT EXCLUDED FROM X FOR A PERIOD OF Y" and ignores line breaks
const REGEX = /DEFENDANT\s+EXCLUDED\s+FROM(?<location1>[\s\S]*?)FOR\s+A\s+PERIOD\s+OF/g

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
    const longestLocation = locations.reduce((a, b) => (a.length > b.length ? a : b), "NONE")

    return `EXCLUDED FROM ${longestLocation}`
  }

  return ""
}

export default licencedPremisesExclusionOrderDisposalText
