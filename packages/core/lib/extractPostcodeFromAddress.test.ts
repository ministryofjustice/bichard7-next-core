import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { extractPostcodeFromAddress, validateAndNormalisePostcode } from "./extractPostcodeFromAddress"

const createMockAho = (address?: { AddressLine4?: string; AddressLine5?: string }): AnnotatedHearingOutcome =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Address: address
          }
        }
      }
    }
  }) as unknown as AnnotatedHearingOutcome

describe("validateAndNormalisePostcode", () => {
  describe("valid postcodes", () => {
    it.each([
      ["compact lowercase without space", "sw1a1aa", "SW1A 1AA"],
      ["standard format with space", "SW1A 1AA", "SW1A 1AA"],
      ["lowercase with space", "sw1a 1aa", "SW1A 1AA"],
      ["mixed case", "w1A 0aX", "W1A 0AX"],
      ["padded with leading/trailing whitespace", "   b33 8th   ", "B33 8TH"],
      ["multiple spaces between outward and inward codes", "EC1A    1BB", "EC1A 1BB"],
      ["single letter area (A9 9AA)", "m11ae", "M1 1AE"],
      ["single letter area with double-digit district (A99 9AA)", "b338th", "B33 8TH"],
      ["double letter area (AA9 9AA)", "cr26xh", "CR2 6XH"],
      ["double letter area with double-digit district (AA99 9AA)", "dn551pt", "DN55 1PT"],
      ["single letter area with letter district (A9A 9AA)", "w1a0ax", "W1A 0AX"],
      ["double letter area with letter district (AA9A 9AA)", "ec1a1bb", "EC1A 1BB"]
    ])("normalises %s to %s", (_, input, expected) => {
      expect(validateAndNormalisePostcode(input)).toBe(expected)
    })
  })

  describe("invalid postcodes or falsy inputs", () => {
    it.each([
      ["undefined", undefined],
      ["empty string", ""],
      ["whitespace only", "   "],
      ["arbitrary address text", "123 High Street"],
      ["city name", "Manchester"],
      ["outward code only", "SW1A"],
      ["inward code only", "1AA"],
      ["extra character in inward code", "SW1A 1AAA"],
      ["inward code missing letter", "SW1A 1A"],
      ["embedded inside a longer sentence", "The postcode is SW1A 1AA"]
    ])("returns undefined for '%s'", (_, input) => {
      expect(validateAndNormalisePostcode(input)).toBeNull()
    })
  })
})

describe("extractPostcodeFromAddress", () => {
  describe("missing or empty address data", () => {
    it("returns null when Address object is undefined", () => {
      const aho = createMockAho(undefined)
      expect(extractPostcodeFromAddress(aho)).toBeNull()
    })

    it("returns null when both AddressLine4 and AddressLine5 are undefined", () => {
      const aho = createMockAho({})
      expect(extractPostcodeFromAddress(aho)).toBeNull()
    })

    it("returns null when both AddressLine4 and AddressLine5 are whitespace or empty", () => {
      const aho = createMockAho({ AddressLine4: "   ", AddressLine5: "" })
      expect(extractPostcodeFromAddress(aho)).toBeNull()
    })

    it("returns null when both lines exist but neither is a valid postcode", () => {
      const aho = createMockAho({
        AddressLine4: "Camden",
        AddressLine5: "London"
      })
      expect(extractPostcodeFromAddress(aho)).toBeNull()
    })
  })

  describe("priority, normalisation, and fallback behavior", () => {
    it("prefers and normalises AddressLine5 when both AddressLine5 and AddressLine4 are valid", () => {
      const aho = createMockAho({
        AddressLine4: "sw1a1aa",
        AddressLine5: "ec1a1bb"
      })
      expect(extractPostcodeFromAddress(aho)).toBe("EC1A 1BB")
    })

    it("normalises AddressLine5 when present and valid", () => {
      const aho = createMockAho({
        AddressLine5: "  m11ae  "
      })
      expect(extractPostcodeFromAddress(aho)).toBe("M1 1AE")
    })

    it("falls back to AddressLine4 and normalises it when AddressLine5 is not a postcode", () => {
      const aho = createMockAho({
        AddressLine4: "cr2 6xh",
        AddressLine5: "Greater London"
      })
      expect(extractPostcodeFromAddress(aho)).toBe("CR2 6XH")
    })

    it("falls back to AddressLine4 when AddressLine5 is undefined", () => {
      const aho = createMockAho({
        AddressLine4: "b338th"
      })
      expect(extractPostcodeFromAddress(aho)).toBe("B33 8TH")
    })

    it("falls back to AddressLine4 when AddressLine5 is empty string", () => {
      const aho = createMockAho({
        AddressLine4: "dn55 1pt",
        AddressLine5: ""
      })
      expect(extractPostcodeFromAddress(aho)).toBe("DN55 1PT")
    })
  })
})
