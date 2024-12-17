import type { Offence } from "../types/AnnotatedHearingOutcome"

import getOffenceCode from "./getOffenceCode"

describe("getOffenceCode", () => {
  it("returns an empty string when offence reason is undefined", () => {
    const offenceReasonInPncFormat = getOffenceCode({
      CriminalProsecutionReference: { OffenceReason: undefined }
    } as Offence)

    expect(offenceReasonInPncFormat).toBeUndefined()
  })

  it("returns the local offence code when offence reason is a local offence", () => {
    const offenceReasonInPncFormat = getOffenceCode({
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "LocalOffenceReason",
          LocalOffenceCode: { OffenceCode: "11412HSD", AreaCode: "56" }
        }
      }
    } as Offence)

    expect(offenceReasonInPncFormat).toBe("11412HSD")
  })

  it("returns the full offence code when national offence reason", () => {
    const offenceReasonInPncFormat = getOffenceCode({
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "NationalOffenceReason",
          OffenceCode: {
            __type: "NonMatchingOffenceCode",
            ActOrSource: "AA",
            Year: "03",
            Reason: "984",
            FullCode: "AA03984"
          }
        }
      }
    } as Offence)

    expect(offenceReasonInPncFormat).toBe("AA03984")
  })
})
