import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"

import cloneDeep from "lodash.clonedeep"

import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendResultQualifierCode from "./amendResultQualifierCode"

describe("disposal qualifier code", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("amends result qualifier variable code to defendant", () => {
    const value = "newQualifierCode"
    const offenceIndex = -1
    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultQualifierVariable[0].Code
    ).not.toBe("newQualifierCode")

    amendResultQualifierCode(
      [
        {
          offenceIndex,
          resultQualifierIndex: 0,
          value
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultQualifierVariable[0].Code
    ).toBe("newQualifierCode")
  })

  it("amends result qualifier variable code to offence", () => {
    const value = "newQualifierCode"
    const offenceIndex = 0
    const resultIndex = 0
    const resultQualifierIndex = 0

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .ResultQualifierVariable[resultQualifierIndex].Code
    ).not.toBe(0)

    amendResultQualifierCode([{ offenceIndex, resultIndex, resultQualifierIndex, value }], aho)

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .ResultQualifierVariable[resultQualifierIndex].Code
    ).toBe(value)
  })

  it("creates result qualifier variable code on offence, if it doesn't already exist", () => {
    const value = "newQualifierCode"
    const offenceIndex = 0
    const resultIndex = 0
    const resultQualifierIndex = 4

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .ResultQualifierVariable[resultQualifierIndex]
    ).toBeUndefined()

    amendResultQualifierCode(
      [
        {
          offenceIndex,
          resultIndex,
          resultQualifierIndex,
          value
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .ResultQualifierVariable[1].Code
    ).toBe(value)
  })

  it("creates result qualifier variable code on defendant, if it doesn't already exist", () => {
    const value = "newQualifierCode"
    const offenceIndex = -1
    const resultQualifierIndex = 4

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultQualifierVariable[
        resultQualifierIndex
      ]
    ).toBeUndefined()

    amendResultQualifierCode(
      [
        {
          offenceIndex,
          resultQualifierIndex,
          value
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultQualifierVariable[1].Code
    ).toBe(value)
  })

  it("throws an error if there is no Result key on HearingDefendant", () => {
    const value = "newQualifierCode"
    const offenceIndex = -1
    const resultQualifierIndex = 4

    delete aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result).toBeUndefined()

    expect(() =>
      amendResultQualifierCode(
        [
          {
            offenceIndex,
            resultQualifierIndex,
            value
          }
        ],
        aho
      )
    ).toThrow("Cannot update the ResultQualifierVariable; Result in undefined")
  })

  it("throw error if there is no ResultIndex key is passing to an offence update", () => {
    const value = "newQualifierCode"
    const offenceIndex = 0
    const resultQualifierIndex = 4

    expect(() =>
      amendResultQualifierCode(
        [
          {
            offenceIndex,
            resultQualifierIndex,
            value
          }
        ],
        aho
      )
    ).toThrow("Cannot update the ResultQualifierVariable; ResultIndex is undefined")
  })

  it("throw error if the offence index is out of the range of the Offence array", () => {
    const value = "newQualifierCode"
    const offenceIndex = 9

    expect(() =>
      amendResultQualifierCode(
        [
          {
            offenceIndex,
            resultQualifierIndex: 4,
            value
          }
        ],
        aho
      )
    ).toThrow("Cannot update the ResultQualifierVariable; offence index is out of range")
  })

  it("amends result qualifier variable code to multiple offences", () => {
    const amendments: Amendments["resultQualifierCode"] = [
      {
        offenceIndex: 0,
        resultIndex: 0,
        resultQualifierIndex: 0,
        value: "new0"
      },
      {
        offenceIndex: 2,
        resultIndex: 0,
        resultQualifierIndex: 0,
        value: "new1"
      },
      {
        offenceIndex: 3,
        resultIndex: 0,
        resultQualifierIndex: 0,
        value: "new2"
      }
    ]

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    amendments.forEach(({ offenceIndex, resultIndex, resultQualifierIndex }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex || 0]
          .ResultQualifierVariable[resultQualifierIndex].Code
      ).not.toBe(0)
    })

    amendResultQualifierCode(amendments, aho)

    amendments.forEach(({ offenceIndex, resultIndex, resultQualifierIndex, value }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex || 0]
          .ResultQualifierVariable[resultQualifierIndex].Code
      ).toBe(value)
    })
  })

  it("amends result qualifier variable code on multiple results in an offence", () => {
    const amendments: Amendments["resultQualifierCode"] = [
      {
        offenceIndex: 0,
        resultIndex: 0,
        resultQualifierIndex: 0,
        value: "new0"
      },
      {
        offenceIndex: 0,
        resultIndex: 1,
        resultQualifierIndex: 0,
        value: "new1"
      }
    ]

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    amendments.forEach(({ offenceIndex, resultIndex, resultQualifierIndex }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex || 0]
          .ResultQualifierVariable[resultQualifierIndex].Code
      ).not.toBe(0)
    })

    amendResultQualifierCode(amendments, aho)

    amendments.forEach(({ offenceIndex, resultIndex, resultQualifierIndex, value }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex || 0]
          .ResultQualifierVariable[resultQualifierIndex].Code
      ).toBe(value)
    })
  })
})
