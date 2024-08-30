import {
  AnnotatedHearingOutcome,
  Offence,
  ResultQualifierVariable
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../test/helpers/createDummyOffence"
import { dummyResultQualifierVariable as dummyResultQualifierVariableArr } from "../../../test/helpers/createDummyResult"
import removeEmptyResultQualifierVariable from "./removeEmptyResultQualifierVariable"

describe("remove empty result qualifier", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence
  let dummyResultQualifierVariable: ResultQualifierVariable[]

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
    dummyResultQualifierVariable = dummyResultQualifierVariableArr as ResultQualifierVariable[]
  })

  it("from defendant result", () => {
    const resultQualifierIndex = 0
    const defendantResult = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result

    if (defendantResult) {
      defendantResult.ResultQualifierVariable[resultQualifierIndex].Code = ""
    }

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultQualifierVariable[
        resultQualifierIndex
      ].Code
    ).toBe("")

    removeEmptyResultQualifierVariable(aho)

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultQualifierVariable[
        resultQualifierIndex
      ]
    ).toBe(undefined)
  })

  it("from offence results", () => {
    const offenceIndex = 2
    const resultIndex = 0
    const resultQualifierIndex = 2

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      dummyOffence,
      dummyOffence,
      dummyOffence,
      dummyOffence
    ]

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
      resultIndex
    ].ResultQualifierVariable = [
      ...dummyResultQualifierVariable,
      ...dummyResultQualifierVariable,
      ...dummyResultQualifierVariable,
      ...dummyResultQualifierVariable
    ]

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
      resultIndex
    ].ResultQualifierVariable[resultQualifierIndex].Code = ""

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
        ?.ResultQualifierVariable[resultQualifierIndex].Code
    ).toBe("")

    removeEmptyResultQualifierVariable(aho)

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[0]
        ?.ResultQualifierVariable[resultQualifierIndex]
    ).toBe(undefined)
  })
})
