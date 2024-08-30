import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import cloneDeep from "lodash.clonedeep"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendResultVariableText from "./amendResultVariableText"

describe("amend fresult variable text", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("amend valid result variable text to defendant result", () => {
    const offenceIndex = -1
    const value = "random_string"
    const resultIndex = 0

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultVariableText).toBe(undefined)

    amendResultVariableText(
      [
        {
          offenceIndex,
          value,
          resultIndex
        }
      ],
      aho
    )

    const actualResultVariableText =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultVariableText

    expect(actualResultVariableText).toEqual(value)
  })

  it("amend valid result variable text to offender result", () => {
    const offenceIndex = 0
    const value = "random_string"
    const resultIndex = 0

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
        .ResultVariableText
    ).toBe(undefined)

    amendResultVariableText(
      [
        {
          offenceIndex,
          value,
          resultIndex
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
        .ResultVariableText
    ).toEqual(value)
  })

  it("throws an error as defendant Result is undefined", () => {
    const offenceIndex = -1
    const value = "random_string"
    const resultIndex = 0

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result = undefined

    expect(() =>
      amendResultVariableText(
        [
          {
            offenceIndex,
            value,
            resultIndex
          }
        ],
        aho
      )
    ).toThrowError("Cannot update the ResultVariableText; Result in undefined")
  })

  it("throws an error if result is out of range", () => {
    const offenceIndex = 0
    const value = "random_string"
    const resultIndex = 2

    expect(() =>
      amendResultVariableText(
        [
          {
            offenceIndex,
            value,
            resultIndex
          }
        ],
        aho
      )
    ).toThrowError("Cannot update ResultVariableText; Result index on Offence is out of range")
  })

  it("throws an error if offence is out of range", () => {
    const offenceIndex = 1
    const value = "random_string"
    const resultIndex = 0

    expect(() =>
      amendResultVariableText(
        [
          {
            offenceIndex,
            value,
            resultIndex
          }
        ],
        aho
      )
    ).toThrowError("Cannot update the ResultVariableText; Offence index is out of range")
  })

  it("amend valid result variable text to multiple offenders", () => {
    const amendments = [
      {
        offenceIndex: 0,
        value: "random_string_0",
        resultIndex: 0
      },
      {
        offenceIndex: 2,
        value: "random_string_2",
        resultIndex: 0
      }
    ]

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    amendments.forEach(({ offenceIndex, resultIndex }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
          .ResultVariableText
      ).toBe(undefined)
    })

    amendResultVariableText(amendments, aho)

    amendments.forEach(({ offenceIndex, resultIndex, value }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
          .ResultVariableText
      ).toEqual(value)
    })
  })

  it("amend valid result variable text for multiple results on an offence", () => {
    const amendments = [
      {
        offenceIndex: 0,
        value: "random_string_0",
        resultIndex: 0
      },
      {
        offenceIndex: 0,
        value: "random_string_1",
        resultIndex: 1
      }
    ]

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    amendments.forEach(({ offenceIndex, resultIndex }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
          .ResultVariableText
      ).toBe(undefined)
    })

    amendResultVariableText(amendments, aho)

    amendments.forEach(({ offenceIndex, resultIndex, value }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
          .ResultVariableText
      ).toEqual(value)
    })
  })
})
