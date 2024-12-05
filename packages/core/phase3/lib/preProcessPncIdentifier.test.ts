import preProcessPncIdentifier from "./preProcessPncIdentifier"

describe("preProcessPncIdentifier", () => {
  it("should remove century", () => {
    const pncIdentifier = "2000/1410801G"
    const expectedPncIdentifier = "00/1410801G"

    const actualPncIdentifier = preProcessPncIdentifier(pncIdentifier)

    expect(actualPncIdentifier).toBe(expectedPncIdentifier)
  })

  it("should remove leading zeros", () => {
    const pncIdentifier = "2000/00410801G"
    const expectedPncIdentifier = "00/410801G"

    const actualPncIdentifier = preProcessPncIdentifier(pncIdentifier)

    expect(actualPncIdentifier).toBe(expectedPncIdentifier)
  })
})
