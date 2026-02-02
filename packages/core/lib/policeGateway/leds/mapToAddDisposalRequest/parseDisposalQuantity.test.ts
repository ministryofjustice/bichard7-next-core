import { parseDisposalQuantity } from "./parseDisposalQuantity"

describe("parseDisposalQuantity", () => {
  test.each([
    ["D123100520240012000.9900", 123, "days", "2024-05-10", 12000.99],
    ["d123100520249999999.9900", 123, "days", "2024-05-10", 9999999.99],
    ["d1  100520240000009.9900", 1, "days", "2024-05-10", 9.99],
    ["Y99910052024          00", 1, "life", "2024-05-10", 0],
    ["D123                  00", 123, "days", undefined, 0],
    ["    10052024          00", 0, "", "2024-05-10", 0]
  ])(
    "parses %s into { count: %d, unit: %s, disposalEffectiveDate: %s, amount: %d }",
    (input, expectedCount, expectedUnits, expectedDate, expectedAmount) => {
      const parsed = parseDisposalQuantity(input)

      expect(parsed.disposalDuration?.count).toBe(expectedCount)
      expect(parsed.disposalDuration?.units).toBe(expectedUnits)
      expect(parsed.disposalEffectiveDate).toBe(expectedDate)
      expect(parsed.amount).toBe(expectedAmount)
    }
  )
})
