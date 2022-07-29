import type { AnnotatedHearingOutcome, HearingDefendant } from "../../../types/AnnotatedHearingOutcome"
import generateMockAho from "../../../../tests/helpers/generateMockAho"
import enrichDefendant from "./enrichDefendant"

describe("enrichDefendant", () => {
  let aho: AnnotatedHearingOutcome
  let defendant: HearingDefendant

  beforeEach(() => {
    aho = generateMockAho()
    defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  })

  it("should update the ASN", () => {
    defendant.ArrestSummonsNumber = "YYFFUUSS123D"
    const result = enrichDefendant(aho)
    expect(result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber).toBe(
      "YYFFUUSS00000000123D"
    )
  })

  it("should deduplicate the bail conditions", () => {
    defendant.BailConditions = ["Condition one", "condition   one", "   condition one    ", "Condition two"]
    const result = enrichDefendant(aho)
    expect(result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions).toStrictEqual([
      "Condition one",
      "Condition two"
    ])
  })

  describe("generating PNC name", () => {
    it("should generate the PNC file name", () => {
      defendant.DefendantDetail.PersonName.FamilyName = "Smith"
      defendant.DefendantDetail.PersonName.GivenName = ["John", "William"]
      const result = enrichDefendant(aho)
      expect(
        result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail.GeneratedPNCFilename
      ).toBe("SMITH/JOHN WILLIAM")
    })

    it("should truncate the PNC file name if it is too long", () => {
      defendant.DefendantDetail.PersonName.FamilyName = "Smith"
      defendant.DefendantDetail.PersonName.GivenName = [
        "John",
        "William",
        "Reallyreallyreallyreallyreallyreallyreallylongname"
      ]
      const result = enrichDefendant(aho)
      const pncFilename =
        result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail.GeneratedPNCFilename
      expect(pncFilename).toHaveLength(54)
      expect(pncFilename).toBe("SMITH/JOHN WILLIAM REALLYREALLYREALLYREALLYREALLYREAL+")
    })
  })
})
