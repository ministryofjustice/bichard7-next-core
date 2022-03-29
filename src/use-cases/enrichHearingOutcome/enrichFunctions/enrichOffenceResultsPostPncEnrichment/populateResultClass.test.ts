import {
  CROWN_COURT,
  RESULT_ADJOURNMENT_POST_JUDGEMENT,
  RESULT_ADJOURNMENT_PRE_JUDGEMENT,
  RESULT_ADJOURNMENT_WITH_JUDGEMENT,
  RESULT_CLASS_PLEAS,
  RESULT_CLASS_RESULT_CODES,
  RESULT_CLASS_VERDICTS,
  RESULT_JUDGEMENT_WITH_FINAL_RESULT,
  RESULT_SENTENCE,
  RESULT_UNRESULTED
} from "src/lib/properties"
import type { Result } from "src/types/AnnotatedHearingOutcome"
import populateResultClass from "./populateResultClass"

const ADJOURNED_RESULT_CODE = 4001
const NON_ADJOURNED_RESULT_CODE = 0

describe("populateResultClass", () => {
  it("should not amend if court type is Crown Court", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      NextResultSourceOrganisation: {
        TopLevelCode: "A",
        SecondLevelCode: "BC",
        ThirdLevelCode: "DE",
        BottomLevelCode: "FG"
      }
    } as Result

    populateResultClass(result, new Date(), new Date(), CROWN_COURT)

    const { ResultClass, NextResultSourceOrganisation } = result
    expect(ResultClass).toBe("Dummy Result Class")
    expect(NextResultSourceOrganisation).toBeDefined()

    const { TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode } = NextResultSourceOrganisation!
    expect(TopLevelCode).toBe("A")
    expect(SecondLevelCode).toBe("BC")
    expect(ThirdLevelCode).toBe("DE")
    expect(BottomLevelCode).toBe("FG")
  })

  it("should unset NextResultSourceOrganisation when adjourned and organisation unit code is not set", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: ADJOURNED_RESULT_CODE,
      NextResultSourceOrganisation: {
        TopLevelCode: "A",
        SecondLevelCode: "BC",
        ThirdLevelCode: "DE",
        BottomLevelCode: "FG"
      }
    } as Result

    populateResultClass(result, new Date(), new Date(), "Dummy Court Type")

    const { NextResultSourceOrganisation } = result
    expect(NextResultSourceOrganisation).toStrictEqual({})
  })

  it("should set the result class to Adjournment post Judgement", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: ADJOURNED_RESULT_CODE
    } as Result

    const convictionDate = new Date("2022-03-28T10:12:13")
    const dateOfHearing = new Date("2022-04-05T10:12:13")
    populateResultClass(result, convictionDate, dateOfHearing, "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_ADJOURNMENT_POST_JUDGEMENT)
  })

  it("should set the result class to Sentence", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: NON_ADJOURNED_RESULT_CODE
    } as Result

    const convictionDate = new Date("2022-03-28T10:12:13")
    const dateOfHearing = new Date("2022-04-05T10:12:13")
    populateResultClass(result, convictionDate, dateOfHearing, "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_SENTENCE)
  })

  it("should set the result class to Adjournment with Judgement", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: ADJOURNED_RESULT_CODE
    } as Result

    const convictionDate = new Date("2022-03-28T10:12:00.000Z")
    const dateOfHearing = new Date("2022-03-28T10:12:00.000Z")
    populateResultClass(result, convictionDate, dateOfHearing, "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_ADJOURNMENT_WITH_JUDGEMENT)
  })

  it("should set the result class to Judgement with final result when adjourned and conviction date is equal to date of hearing", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: NON_ADJOURNED_RESULT_CODE
    } as Result

    const convictionDate = new Date("2022-03-28T10:12:00.000Z")
    const dateOfHearing = new Date("2022-03-28T10:12:00.000Z")
    populateResultClass(result, convictionDate, dateOfHearing, "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_JUDGEMENT_WITH_FINAL_RESULT)
  })

  it("should set the result class to Judgement with final result when not adjourned and plea is in pleas list", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: NON_ADJOURNED_RESULT_CODE,
      PleaStatus: RESULT_CLASS_PLEAS[0]
    } as Result

    populateResultClass(result, undefined, new Date(), "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_JUDGEMENT_WITH_FINAL_RESULT)
  })

  it("should set the result class to Unresulted when adjourned and CJSE result code is in result codes list", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: RESULT_CLASS_RESULT_CODES[0],
      NextResultSourceOrganisation: {
        OrganisationUnitCode: "ABCDEFG"
      }
    } as Result

    populateResultClass(result, undefined, new Date(), "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_UNRESULTED)
  })

  it("should set the result class to Unresulted when adjourned and verdict is in verdicts list", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: ADJOURNED_RESULT_CODE,
      Verdict: RESULT_CLASS_VERDICTS[0]
    } as Result

    populateResultClass(result, undefined, new Date(), "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_UNRESULTED)
  })

  it("should set the result class to Judgement with final result when not adjourned and CJSE result code is in result codes list", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: RESULT_CLASS_RESULT_CODES[0]
    } as Result

    populateResultClass(result, undefined, new Date(), "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_JUDGEMENT_WITH_FINAL_RESULT)
  })

  it("should set the result class to Judgement with final result when not adjourned and verdict is in verdicts list", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: NON_ADJOURNED_RESULT_CODE,
      Verdict: RESULT_CLASS_VERDICTS[0]
    } as Result

    populateResultClass(result, undefined, new Date(), "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_JUDGEMENT_WITH_FINAL_RESULT)
  })

  it("should set the result class to Adjournment pre Judgement", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: ADJOURNED_RESULT_CODE,
      Verdict: undefined
    } as Result

    populateResultClass(result, undefined, new Date(), "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_ADJOURNMENT_PRE_JUDGEMENT)
  })

  it("should set the result class to Unresulted for all other cases", () => {
    const result = {
      ResultClass: "Dummy Result Class",
      CJSresultCode: NON_ADJOURNED_RESULT_CODE,
      Verdict: "Dummy Verdict"
    } as Result

    populateResultClass(result, undefined, new Date(), "Dummy Court Type")

    expect(result.ResultClass).toBe(RESULT_UNRESULTED)
  })
})
