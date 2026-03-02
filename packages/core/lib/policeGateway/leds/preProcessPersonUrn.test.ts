import preProcessPersonUrn from "./preProcessPersonUrn"

describe("preProcessPersonUrn", () => {
  it("should use 2-digit year format and remove leading zeros from id", () => {
    const personUrn = "201950/0000123X"
    const expectedPersonUrn = "1950/123X"

    const actualPersonUrn = preProcessPersonUrn(personUrn)

    expect(actualPersonUrn).toBe(expectedPersonUrn)
  })

  it("should return undefined if input is empty string", () => {
    const actualPersonUrn = preProcessPersonUrn("")

    expect(actualPersonUrn).toBeUndefined()
  })

  it("should return undefined if input is undefined", () => {
    const actualPersonUrn = preProcessPersonUrn(undefined)

    expect(actualPersonUrn).toBeUndefined()
  })

  it("should return undefined if id is missing", () => {
    const actualPersonUrn = preProcessPersonUrn("123")

    expect(actualPersonUrn).toBeUndefined()
  })

  it("should return undefined if year is missing", () => {
    const actualPersonUrn = preProcessPersonUrn("/123")

    expect(actualPersonUrn).toBeUndefined()
  })
})
