import type { Offence } from "src/types/AnnotatedHearingOutcome"
import enrichOffence from "./enrichOffence"

describe("enrichOffence()", () => {
  it("should add the data from the looked up offence", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "LocalOffenceReason",
          LocalOffenceCode: { AreaCode: "05", OffenceCode: "BG73006" }
        }
      }
    } as Offence
    const result = enrichOffence(offence)
    expect(result).toMatchSnapshot()
  })

  it("should add an offence category of B7 if the offence is ignored", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "LocalOffenceReason",
          LocalOffenceCode: { AreaCode: "05", OffenceCode: "05MC001" }
        }
      }
    } as Offence
    const result = enrichOffence(offence)
    expect(result.OffenceCategory).toBe("B7")
  })

  it("should set recordable to false if the offence is ignored", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "LocalOffenceReason",
          LocalOffenceCode: { AreaCode: "05", OffenceCode: "05MC001" }
        }
      },
      RecordableOnPNCindicator: "Y"
    } as Offence
    const result = enrichOffence(offence)
    expect(result.RecordableOnPNCindicator).toBe("N")
  })
})
