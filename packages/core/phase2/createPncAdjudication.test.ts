import createPncAdjudication from "./createPncAdjudication"

describe("check createPncAdjudication", () => {
  it("Given plea status code 2060, the adjucation plea status is an empty string", () => {
    const result = createPncAdjudication(2060, "PLEA_STATUS", "FOO", new Date(), 3)
    expect(result.plea).toBe("")
  })
  it("Given a different plea status code, the adjucation plea status is the input plea status", () => {
    const pleaStatus = "PLEA_STATUS"
    const result = createPncAdjudication(9999, pleaStatus, "FOO", new Date(), 3)
    expect(result.plea).toBe(pleaStatus)
  })
  it("Given a guilty disposal code, the adjucation verdict is correct", () => {
    const guiltyDisposalCode = 1029
    const expectedVerdict = "GUILTY"
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "FOO", new Date(), 3)
    expect(result.verdict).toBe(expectedVerdict)
  })
  it("Given a not guilty disposal code, the adjucation verdict is correct", () => {
    const guiltyDisposalCode = 2006
    const expectedVerdict = "NOT GUILTY"
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "FOO", new Date(), 3)
    expect(result.verdict).toBe(expectedVerdict)
  })
  it("Given a non conviction disposal code, the adjucation verdict is correct", () => {
    const guiltyDisposalCode = 2006
    const expectedVerdict = "NOT GUILTY"
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "FOO", new Date(), 3)
    expect(result.verdict).toBe(expectedVerdict)
  })
  it("Given an empty verdict disposal code, the adjucation verdict is correct", () => {
    const guiltyDisposalCode = 2058
    const expectedVerdict = ""
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "FOO", new Date(), 3)
    expect(result.verdict).toBe(expectedVerdict)
  })
  it("Given an unknown disposal code, and no verdict, the verdict is correct", () => {
    const guiltyDisposalCode = 9999
    const expectedVerdict = "NON-CONVICTION"
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "", new Date(), 3)
    expect(result.verdict).toBe(expectedVerdict)
  })
  it("Given an unknown disposal code, and a verdict, the verdict is correct", () => {
    const guiltyDisposalCode = 9999
    const expectedVerdict = "FOOBAR"
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "FOOBAR", new Date(), 3)
    expect(result.verdict).toBe(expectedVerdict)
  })
  it("Given a non-date-setting disposal code, the date of sentence is correct", () => {
    const guiltyDisposalCode = 2059
    const expectedDate = undefined
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "FOOBAR", new Date(), 3)
    expect(result.sentenceDate).toBe(expectedDate)
  })
  it("Given a date-setting disposal code, the date of sentence is correct", () => {
    const guiltyDisposalCode = 9999
    const expectedDate = new Date("2023-10-10")
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "FOOBAR", expectedDate, 3)
    expect(result.sentenceDate).toBe(expectedDate)
  })
  it("Given an undefined disposal code and no verdict, returns default verdict", () => {
    const guiltyDisposalCode = undefined
    const expectedDate = new Date("2023-10-10")
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "", expectedDate, 3)
    expect(result.verdict).toBe("NON-CONVICTION")
  })
  it("Given an undefined disposal code and verdict, returns verdict", () => {
    const guiltyDisposalCode = undefined
    const expectedDate = new Date("2023-10-10")
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "VERDICT", expectedDate, 3)
    expect(result.verdict).toBe("VERDICT")
  })
  it("Given a number of offences taken into account, the adjunction number of offences TIC is correct", () => {
    const guiltyDisposalCode = 9999
    const expectedNumberOfOffencesTIC = 3
    const result = createPncAdjudication(guiltyDisposalCode, "PLEA_STATUS", "FOOBAR", new Date(), 3)
    expect(result.offenceTICNumber).toBe(expectedNumberOfOffencesTIC)
  })
})
