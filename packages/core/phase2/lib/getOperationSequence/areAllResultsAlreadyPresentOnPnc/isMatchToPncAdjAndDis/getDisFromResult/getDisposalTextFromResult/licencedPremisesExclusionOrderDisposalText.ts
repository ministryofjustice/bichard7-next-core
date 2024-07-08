// regex matchs "DEFENDANT EXCLUDED FROM X FOR A PERIOD OF Y" and ignores line breaks
const regex = /DEFENDANT\s+EXCLUDED\s+FROM(?<location1>[\s\S]*?)FOR\s+A\s+PERIOD\s+OF/g

const licencedPremisesExclusionOrderDisposalText = (resultVariableText: string): string => {
  let match: RegExpExecArray | null
  const locations: string[] = []

  while ((match = regex.exec(resultVariableText)) !== null) {
    if (match.groups) {
      Object.values(match.groups).forEach(
        (location) => location && locations.push(location.replace(/\s+/g, " ").trim())
      )
    }
  }

  const longestLocation = locations.reduce((a, b) => (a.length > b.length ? a : b), "")
  return locations.length ? `EXCLUDED FROM ${longestLocation}` : ""
}

export default licencedPremisesExclusionOrderDisposalText
