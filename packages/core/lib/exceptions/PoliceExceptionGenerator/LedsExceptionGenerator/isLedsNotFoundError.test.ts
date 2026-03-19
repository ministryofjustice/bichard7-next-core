import isLedsNotFoundError from "./isLedsNotFoundError"

describe("isLedsNotFoundError", () => {
  it.each([
    { message: "No matching arrest reports found for asn", expected: true },
    { message: "nO MaTcHiNg ArReSt RePoRtS fOuNd FoR aSn", expected: true },
    { message: "before message No matching arrest reports found for asn after message", expected: true },
    { message: "matching arrest reports found for asn", expected: false },
    { message: "", expected: false }
  ])('should return $expected when message is "$message"', ({ expected, message }) => {
    const result = isLedsNotFoundError(message)

    expect(result).toBe(expected)
  })
})
