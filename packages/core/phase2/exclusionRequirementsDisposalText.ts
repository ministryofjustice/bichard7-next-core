// regex matchs "NOT ENTER X THIS EXCLUSION LASTS FOR" or "NOT TO ENTER X THIS EXCLUSION LASTS FOR" and ignores line breaks

const REGEX =
  /NOT\s+TO\s+ENTER(?<location1>[\s\S]*?)THIS\s+EXCLUSION\s+REQUIREMENT\s+LASTS\s+FOR|NOT\s+ENTER(?<location2>[\s\S]*?)THIS\s+EXCLUSION\s+REQUIREMENT\s+LASTS\s+FOR/gs

const REGEX2 = /NOT\s+TO\s+ENTER\s(?<location3>[\s\S]*)/g

const exclusionRequirementsDisposalText = (resultVariableText: string): string => {

  const locations: string[] = []

  const matches = [...resultVariableText.matchAll(REGEX)]
  
  const capturedValues = matches
  .flatMap((match) => Object.values(match.groups || {}).filter(x=>x).map((value) => value.replace(/\s+/g, " ").trim()))
  
  capturedValues.forEach( (value) => {
    const nestedMatches = [...value.matchAll(REGEX2)]
    if (nestedMatches.length > 0) {
      nestedMatches.forEach((match) => {
        if (match.groups) {
          Object.values(match.groups).forEach((group) => {
            locations.push(group)
          })
        }
      })
    } else {
      locations.push(value)
    }
  })

  if (locations.length) {
    const longestLocation = locations.reduce((a, b) => (a.length > b.length ? a : b))

    return `EXCLUDED FROM ${longestLocation}`
  }

  return ""
}

export default exclusionRequirementsDisposalText
