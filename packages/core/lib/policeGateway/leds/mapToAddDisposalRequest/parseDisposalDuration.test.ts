import { parseDisposalDuration } from "./parseDisposalDuration"

describe("parseDisposalDuration", () => {
  test.each([
    ["D123100520240012000.9900", "days", 123],
    ["d123100520249999999.9900", "days", 123],
    ["d1  100520240000009.9900", "days", 1],
    ["Y99910052024          00", "life", 1],
    ["Y999", "life", 1],
    ["D123", "days", 123]
  ])("parses %s into { units: %s, count: %d}", (input, expectedUnits, expectedCount) => {
    const parsed = parseDisposalDuration(input)

    expect(parsed.units).toBe(expectedUnits)
    expect(parsed.count).toBe(expectedCount)
  })
})
