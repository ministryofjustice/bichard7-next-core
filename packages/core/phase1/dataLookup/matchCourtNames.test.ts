import matchCourtNames from "phase1/dataLookup/matchCourtNames"

describe("matchCourtNames()", () => {
  it("shouldReturnFalseWhenNoMatch()", () => {
    const courtNameA = "Manchester"
    const courtNameB = "Portsmouth"
    const expectedResult = false

    const result = matchCourtNames(courtNameA, courtNameB)
    expect(result).toBe(expectedResult)
  })

  it("shouldReturnTrueWhenExactMatch()", () => {
    const courtNameA = "Southampton"
    const courtNameB = courtNameA
    const expectedResult = true

    const result = matchCourtNames(courtNameA, courtNameB)
    expect(result).toBe(expectedResult)
  })

  it("shouldReturnTrueWhenNonExactMatch()", () => {
    const courtNameA = "Newport (I.O.W.)"
    const courtNameB = "Newport IOW"
    const expectedResult = true

    const result = matchCourtNames(courtNameA, courtNameB)
    expect(result).toBe(expectedResult)
  })

  it("shouldReturnTrueWhenNonExactMatchAndSpaces()", () => {
    const courtNameA = "Newport (I.O.W.)"
    const courtNameB = "Newport I O W"
    const expectedResult = true

    const result = matchCourtNames(courtNameA, courtNameB)
    expect(result).toBe(expectedResult)
  })

  it("shouldReturnTrueWhenStringsMatchButNotAtStart()", () => {
    const courtNameA = "Manchester"
    const courtNameB = "Minshull Street Manchester"
    const expectedResult = false

    const result = matchCourtNames(courtNameA, courtNameB)
    expect(result).toBe(expectedResult)
  })

  it("shouldReturnFalseWhenStringsMatchButNotAtWordBoundary()", () => {
    const courtNameA = "Ports"
    const courtNameB = "Portsmouth"
    const expectedResult = false

    const result = matchCourtNames(courtNameA, courtNameB)
    expect(result).toBe(expectedResult)
  })

  it("shouldReturnTrueWhenStringsMatchAtWordBoundary()", () => {
    const courtNameA = "Portsmouth"
    const courtNameB = "Portsmouth Crown Court"
    const expectedResult = true

    const result = matchCourtNames(courtNameA, courtNameB)
    expect(result).toBe(expectedResult)
  })

  it("shouldReturnTrueWhenStringsMatchCaseInsensitive()", () => {
    const courtNameA = "Liverpool"
    const courtNameB = "LivERpOol"
    const expectedResult = true

    const result = matchCourtNames(courtNameA, courtNameB)
    expect(result).toBe(expectedResult)
  })

  it("shouldReturnFalseWhenCourtNameAIsEmpty()", () => {
    const courtNameA = ""
    const courtNameB = "Liverpool"
    const expectedResult = false

    const result = matchCourtNames(courtNameA, courtNameB)
    expect(result).toBe(expectedResult)
  })

  it("shouldReturnFalseWhenCourtNameBIsEmpty()", () => {
    const courtNameA = "Liverpool"
    const courtNameB = ""
    const expectedResult = false

    const result = matchCourtNames(courtNameA, courtNameB)
    expect(result).toBe(expectedResult)
  })
})
