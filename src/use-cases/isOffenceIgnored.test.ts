import type { Offence } from "src/types/AnnotatedHearingOutcome"
import isOffenceIgnored from "./isOffenceIgnored"

describe("isOffenceIgnored()", () => {
  it("should return true if the offence is in the ignore list", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "LocalOffenceReason",
          LocalOffenceCode: { AreaCode: "05", OffenceCode: "05MC001" }
        }
      }
    } as Offence
    const result = isOffenceIgnored(offence)
    expect(result).toBe(true)
  })

  it("should return false if the offence is not in the ignore list", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "LocalOffenceReason",
          LocalOffenceCode: { AreaCode: "05", OffenceCode: "05MC002" }
        }
      }
    } as Offence
    const result = isOffenceIgnored(offence)
    expect(result).toBe(false)
  })
})
