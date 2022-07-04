// const matchCourtNamesRegex = (courtNameA: string, courtNameB: string): boolean => {
//   const notAlphabetic = /[^\p{L}]+/i
//   const courtNameARegex = new RegExp(`^${courtNameA.split(notAlphabetic).join("[^\\p{L}]*")}\\b`, "i")
//   return courtNameARegex.test(courtNameB)
// }

// const matchCourtNames = (courtNameA: string, courtNameB: string): boolean =>
//   !!courtNameA &&
//   !!courtNameB &&
//   (matchCourtNamesRegex(courtNameA, courtNameB) || matchCourtNamesRegex(courtNameB, courtNameA))

const sanitiseCourtName = (courtName: string): string => courtName.replace(/\W/g, "").toLowerCase()

const matchCourtNames = (courtNameA: string, courtNameB: string): boolean =>
  sanitiseCourtName(courtNameA) === sanitiseCourtName(courtNameB)

export default matchCourtNames
