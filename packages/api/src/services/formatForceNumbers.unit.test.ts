import formatForceNumbers from "./formatForceNumbers"

describe("formatForceNumbers", () => {
  it("handles empty strings", () => {
    const result = formatForceNumbers("")

    expect(result).toEqual([])
  })

  it("handles a zero padded", () => {
    const result = formatForceNumbers("001")

    expect(result).toEqual([1])
  })

  it("handles string with commas", () => {
    const result = formatForceNumbers("001,045,3")

    expect(result).toEqual([1, 45, 3])
  })
})
