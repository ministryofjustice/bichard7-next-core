import type { Result } from "../../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../../types/ResultClass"
import populateResultClass from "./populateResultClass"

const ADJOURNED_RESULT_CODE = 4001
const NON_ADJOURNED_RESULT_CODE = 0

describe("populateResultClass", () => {
  it("should unset NextResultSourceOrganisation when adjourned and organisation unit code is not set", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: ADJOURNED_RESULT_CODE,
      NextResultSourceOrganisation: {
        TopLevelCode: "A",
        SecondLevelCode: "BC",
        ThirdLevelCode: "DE",
        BottomLevelCode: "FG"
      }
    } as Result

    populateResultClass(result, new Date(), new Date())

    const { NextResultSourceOrganisation } = result
    expect(NextResultSourceOrganisation).toBeUndefined()
  })

  it("should set the result class to Adjournment post Judgement", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: ADJOURNED_RESULT_CODE
    } as Result

    const convictionDate = new Date("2022-03-28T10:12:13")
    const dateOfHearing = new Date("2022-04-05T10:12:13")
    populateResultClass(result, convictionDate, dateOfHearing)

    expect(result.ResultClass).toBe(ResultClass.ADJOURNMENT_POST_JUDGEMENT)
  })

  it("should set the result class to Sentence", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: NON_ADJOURNED_RESULT_CODE
    } as Result

    const convictionDate = new Date("2022-03-28T10:12:13")
    const dateOfHearing = new Date("2022-04-05T10:12:13")
    populateResultClass(result, convictionDate, dateOfHearing)

    expect(result.ResultClass).toBe(ResultClass.SENTENCE)
  })

  it("should set the result class to Adjournment with Judgement", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: ADJOURNED_RESULT_CODE
    } as Result

    const convictionDate = new Date("2022-03-28T10:12:00.000Z")
    const dateOfHearing = new Date("2022-03-28T10:12:00.000Z")
    populateResultClass(result, convictionDate, dateOfHearing)

    expect(result.ResultClass).toBe(ResultClass.ADJOURNMENT_WITH_JUDGEMENT)
  })

  it("should set the result class to Judgement with final result when adjourned and conviction date is equal to date of hearing", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: NON_ADJOURNED_RESULT_CODE
    } as Result

    const convictionDate = new Date("2022-03-28T10:12:00.000Z")
    const dateOfHearing = new Date("2022-03-28T10:12:00.000Z")
    populateResultClass(result, convictionDate, dateOfHearing)

    expect(result.ResultClass).toBe(ResultClass.JUDGEMENT_WITH_FINAL_RESULT)
  })

  it("should set the result class to Judgement with final result when not adjourned and plea is in pleas list", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: NON_ADJOURNED_RESULT_CODE,
      PleaStatus: "ADM"
    } as Result

    populateResultClass(result, undefined, new Date())

    expect(result.ResultClass).toBe(ResultClass.JUDGEMENT_WITH_FINAL_RESULT)
  })

  it("should set the result class to Unresulted when adjourned and CJS result code is in result codes list", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: 2050,
      NextResultSourceOrganisation: {
        OrganisationUnitCode: "ABCDEFG"
      }
    } as Result

    populateResultClass(result, undefined, new Date())

    expect(result.ResultClass).toBe(ResultClass.UNRESULTED)
  })

  it("should set the result class to Unresulted when adjourned and verdict is in verdicts list", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: ADJOURNED_RESULT_CODE,
      Verdict: "NG"
    } as Result

    populateResultClass(result, undefined, new Date())

    expect(result.ResultClass).toBe(ResultClass.UNRESULTED)
  })

  it("should set the result class to Judgement with final result when not adjourned and CJS result code is in result codes list", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: 2050
    } as Result

    populateResultClass(result, undefined, new Date())

    expect(result.ResultClass).toBe(ResultClass.JUDGEMENT_WITH_FINAL_RESULT)
  })

  it("should set the result class to Judgement with final result when not adjourned and verdict is in verdicts list", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: NON_ADJOURNED_RESULT_CODE,
      Verdict: "NG"
    } as Result

    populateResultClass(result, undefined, new Date())

    expect(result.ResultClass).toBe(ResultClass.JUDGEMENT_WITH_FINAL_RESULT)
  })

  it("should set the result class to Adjournment pre Judgement", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: ADJOURNED_RESULT_CODE,
      Verdict: undefined
    } as Result

    populateResultClass(result, undefined, new Date())

    expect(result.ResultClass).toBe(ResultClass.ADJOURNMENT_PRE_JUDGEMENT)
  })

  it("should set the result class to Unresulted for all other cases", () => {
    const result = {
      ResultClass: ResultClass.UNRESULTED,
      CJSresultCode: NON_ADJOURNED_RESULT_CODE,
      Verdict: "phase1/types/Verdict"
    } as Result

    populateResultClass(result, undefined, new Date())

    expect(result.ResultClass).toBe(ResultClass.UNRESULTED)
  })
})
