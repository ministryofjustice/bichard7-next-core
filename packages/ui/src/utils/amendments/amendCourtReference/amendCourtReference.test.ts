import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import amendCourtReference from "./amendCourtReference"

describe("court reference", () => {
  let aho: AnnotatedHearingOutcome

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
  })

  it("amend magristates court reference", () => {
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference?.MagistratesCourtReference).toBe(
      "random_magristrates_ref"
    )

    amendCourtReference("updated_value", aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference.MagistratesCourtReference).toBe(
      "updated_value"
    )
  })

  it("throws an error if no crown court and magistrates court reference", () => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference.MagistratesCourtReference = ""
    delete aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference.CrownCourtReference
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference?.CrownCourtReference).toBeUndefined()
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference?.MagistratesCourtReference).toBe("")

    expect(() => amendCourtReference("updated_value", aho)).toThrow(
      "Cannot set CourtReference since unable to distinguish between Magistrates and Crown Court"
    )
  })
})
