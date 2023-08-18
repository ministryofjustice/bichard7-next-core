import generateMockAho from "phase1/tests/helpers/generateMockAho"
import type { AnnotatedHearingOutcome, Urgent } from "types/AnnotatedHearingOutcome"
import enrichCase from "./enrichCase"

let aho: AnnotatedHearingOutcome

describe("enrich case", () => {
  beforeEach(() => {
    aho = generateMockAho()
  })

  it("should return AHO enriched with case", () => {
    const result = enrichCase(aho)

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })

  it("sets the case RecordableOnPNCindicator when there is an offence with RecordableOnPNCindicator", () => {
    aho = generateMockAho()

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].RecordableOnPNCindicator = false
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[1].RecordableOnPNCindicator = false

    const resultWithoutRecordableOnPNCindicator = enrichCase(aho)
    expect(
      resultWithoutRecordableOnPNCindicator.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator
    ).toBe(false)

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].RecordableOnPNCindicator = true

    const resultWithRecordableOnPNCindicator = enrichCase(aho)
    expect(
      resultWithRecordableOnPNCindicator.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator
    ).toBe(true)
  })

  describe("when there is an offence with urgency below HALF_LIFE_HOURS_URGENT_THRESHOLD(48)", () => {
    it("populates the urgent object of the case", () => {
      aho = generateMockAho()

      const expectedUrgent: Urgent = {
        urgency: 1,
        urgent: true
      }

      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].Urgent = expectedUrgent

      const result = enrichCase(aho)
      expect(result.AnnotatedHearingOutcome.HearingOutcome.Case.Urgent).toEqual(expectedUrgent)
    })
  })

  describe("when there is an offence with urgency greater than or equal to HALF_LIFE_HOURS_URGENT_THRESHOLD(48)", () => {
    it("does not populates urgent field", () => {
      aho = generateMockAho()

      const urgent: Urgent = {
        urgency: 48,
        urgent: true
      }

      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].Urgent = urgent

      const result = enrichCase(aho)
      expect(result.AnnotatedHearingOutcome.HearingOutcome.Case.Urgent).toBeUndefined()
    })
  })

  describe("when the MagistratesCourtReference is Truncated", () => {
    it("sets the MagistratesCourtReference to PTIURN", () => {
      aho = generateMockAho()

      aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference.MagistratesCourtReference = "Truncated"

      const result = enrichCase(aho)
      expect(result.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference.MagistratesCourtReference).toEqual(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN
      )
    })
  })
})
