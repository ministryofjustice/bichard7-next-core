import preProcessPreTrialIssuesUniqueReferenceNumber from "./preProcessPreTrialIssuesUniqueReferenceNumber"

describe("preProcessPreTrialIssuesUniqueReferenceNumber", () => {
  it("should use force owner to generate PTIURN when force owner length is 6 characters and PTIURN has value", () => {
    const result = preProcessPreTrialIssuesUniqueReferenceNumber("02ZD03032082384750192834", "01ZD00")

    expect(result).toBe("01ZD/03032082384750")
  })

  it("should use force owner to generate PTIURN when force owner length is 6 characters and PTIURN is undefined", () => {
    const result = preProcessPreTrialIssuesUniqueReferenceNumber(undefined, "01ZD00")

    expect(result).toBe("01ZD/")
  })

  it("should use the passed PTIURN to generate PTIURN when force owner length is not 6 characters and PTIURN has value", () => {
    const result = preProcessPreTrialIssuesUniqueReferenceNumber("02ZD03032082384750192834", "01ZD")

    expect(result).toBe("02ZD/03032082384750")
  })

  it("should return 4 whitespaces and a forward-slash when force owner length is not 6 characters and PTIURN is empty string", () => {
    const result = preProcessPreTrialIssuesUniqueReferenceNumber("", "01ZD")

    expect(result).toBe("    /")
  })

  it("should return 4 whitespaces and a forward-slash when force owner length is not 6 characters and PTIURN is undefined", () => {
    const result = preProcessPreTrialIssuesUniqueReferenceNumber(undefined, "01ZD")

    expect(result).toBe("    /")
  })

  it("should return 4 whitespaces and a forward-slash when force owner and PTIURN are undefined", () => {
    const result = preProcessPreTrialIssuesUniqueReferenceNumber(undefined, "01ZD")

    expect(result).toBe("    /")
  })
})
