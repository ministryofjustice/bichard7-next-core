import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import offenceIsBreach from "./offenceIsBreach"

describe("offenceIsBreach()", () => {
  it("should say an offence in a breach category is a breach offence", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "NationalOffenceReason",
          OffenceCode: {
            __type: "NonMatchingOffenceCode",
            FullCode: "CO88013"
          }
        }
      },
      OffenceCategory: "CB"
    }

    const isBreach = offenceIsBreach(offence as Offence)
    expect(isBreach).toBe(true)
  })

  it("should say an offence not in a breach category is not a breach offence", () => {
    const offence = {
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "NationalOffenceReason",
          OffenceCode: {
            __type: "NonMatchingOffenceCode",
            FullCode: "CO88013"
          }
        }
      },
      OffenceCategory: "CE"
    }

    const isBreach = offenceIsBreach(offence as Offence)
    expect(isBreach).toBe(false)
  })
})
