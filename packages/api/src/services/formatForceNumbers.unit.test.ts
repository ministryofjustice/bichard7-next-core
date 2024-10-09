import formatForceNumbers from "@/services/formatForceNumbers"

describe("formatForceNumbers", () => {
  it("handles undefined", () => {
    const result = formatForceNumbers()

    expect(result).toEqual([])
  })

  it("handles null", () => {
    const result = formatForceNumbers(null)

    expect(result).toEqual([])
  })

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

  it("ignores chars", () => {
    const result = formatForceNumbers("001,045,happy,3")

    expect(result).toEqual([1, 45, 3])
  })
})
