const notAlphabetic = /\W+/i

const nameMatches = (nameA: string, nameB: string) => {
  // Split the name on non alphabetic characters
  const chunksA = nameA.split(notAlphabetic)
  // Join the chunks together with a wildcard between them of zero or more non alphabetic characters
  const regexA = new RegExp(`^${chunksA.join("\\W*")}\\b`, "i")
  return !!nameB.match(regexA)
}

const matchCourtNames = (courtNameA: string, courtNameB: string): boolean =>
  !!courtNameA && !!courtNameB && (nameMatches(courtNameA, courtNameB) || nameMatches(courtNameB, courtNameA))

export default matchCourtNames
