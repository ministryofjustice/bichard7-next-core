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
    const { result, exception } = lookupOffenceCode(
      "01CP001",
      localOffence.CriminalProsecutionReference.OffenceReason,
      "01"
    )
    const offence = enrichOffence(localOffence, false, result)
    expect(offence).toMatchSnapshot()
    expect(exception).toBeUndefined()
  })

  it("should add an offence category of B7 if the offence is ignored", () => {
    const { result, exception } = lookupOffenceCode(
      "01CP001",
      localOffence.CriminalProsecutionReference.OffenceReason,
      "01"
    )
    const offence = enrichOffence(localOffence, true, result)

    expect(offence).toMatchSnapshot()
    expect(offence.OffenceCategory).toBe("B7")
    expect(exception).toBeUndefined()
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

    const { result, exception } = lookupOffenceCode(
      "01CP001",
      mockOffence.CriminalProsecutionReference.OffenceReason,
      "01"
    )
    const offence = enrichOffence(mockOffence, false, result)

    expect(offence).toMatchSnapshot()
    expect(offence?.RecordableOnPNCindicator).toBe(false)
    expect(exception).toBeUndefined()
  })
})
