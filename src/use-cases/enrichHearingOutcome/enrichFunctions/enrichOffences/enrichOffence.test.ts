import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/types/types"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import lookupOffenceCode from "src/utils/offence/lookupOffenceCode"
import enrichOffence from "./enrichOffence"

const localOffence = {
  CriminalProsecutionReference: {
    OffenceReason: {
      __type: "LocalOffenceReason",
      LocalOffenceCode: { AreaCode: "01", OffenceCode: "01CP001" }
    }
  }
} as Offence

describe("enrichOffence()", () => {
  it("should add the data from the looked up offence", () => {
    const result = lookupOffenceCode("01CP001", localOffence.CriminalProsecutionReference.OffenceReason, "01")

    expect(result).not.toBeInstanceOf(Error)
    const offence = enrichOffence(localOffence, false, result as OffenceCode)
    expect(offence).toMatchSnapshot()
  })

  it("should add an offence category of B7 if the offence is ignored", () => {
    const result = lookupOffenceCode("01CP001", localOffence.CriminalProsecutionReference.OffenceReason, "01")
    expect(result).not.toBeInstanceOf(Error)
    const offence = enrichOffence(localOffence, true, result as OffenceCode)

    expect(offence).toMatchSnapshot()
    expect(offence.OffenceCategory).toBe("B7")
  })

  it("should set recordable to false if the offence is ignored", () => {
    const mockOffence = {
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "LocalOffenceReason",
          LocalOffenceCode: { AreaCode: "01", OffenceCode: "01CP001" }
        }
      },
      RecordableOnPNCindicator: true
    } as Offence

    const result = lookupOffenceCode("01CP001", mockOffence.CriminalProsecutionReference.OffenceReason, "01")
    expect(result).not.toBeInstanceOf(Error)
    const offence = enrichOffence(mockOffence, false, result as OffenceCode)

    expect(offence).toMatchSnapshot()
    expect(offence?.RecordableOnPNCindicator).toBe(false)
  })
})
