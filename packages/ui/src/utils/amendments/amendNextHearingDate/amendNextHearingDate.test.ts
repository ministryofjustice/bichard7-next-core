import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

import cloneDeep from "lodash.clonedeep"

import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendNextHearingDate from "./amendNextHearingDate"

describe("amend fresult variable text", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("amend valid next hearing date to defendant result", () => {
    const offenceIndex = -1
    const value = "2022-08-24"
    const resultIndex = 0

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextHearingDate).toBeUndefined()

    amendNextHearingDate([{ offenceIndex, resultIndex, value }], aho)

    const actualNextHearingDate =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextHearingDate

    expect(actualNextHearingDate).toEqual(value)
  })

  it("amend valid next hearing date to offender result", () => {
    const offenceIndex = 0
    const value = "2022-08-24"
    const resultIndex = 0

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .NextHearingDate
    ).toBeUndefined()

    amendNextHearingDate([{ offenceIndex, resultIndex, value }], aho)

    const actualNextHearingDate =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .NextHearingDate

    expect(actualNextHearingDate).toEqual(value)
  })

  it("throws an error as defendant Result is undefined", () => {
    const offenceIndex = -1
    const value = "2022-08-24"
    const resultIndex = 0

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result = undefined

    expect(() =>
      amendNextHearingDate(
        [
          {
            offenceIndex,
            resultIndex,
            value
          }
        ],
        aho
      )
    ).toThrow("Cannot update the NextHearingDate; Result in undefined")
  })

  it("throws an error if result is out of range", () => {
    const offenceIndex = 0
    const value = "2022-08-24"
    const resultIndex = 2

    expect(() =>
      amendNextHearingDate(
        [
          {
            offenceIndex,
            resultIndex,
            value
          }
        ],
        aho
      )
    ).toThrow("Cannot update NextHearingDate; Result index on Offence is out of range")
  })

  it("throws an error if offence is out of range", () => {
    const offenceIndex = 1
    const value = "2022-08-24"
    const resultIndex = 0

    expect(() =>
      amendNextHearingDate(
        [
          {
            offenceIndex,
            resultIndex,
            value
          }
        ],
        aho
      )
    ).toThrow("Cannot update the NextHearingDate; Offence index is out of range")
  })

  it("amend valid next hearing date to multiple offences", () => {
    const amendments = [
      {
        offenceIndex: 0,
        resultIndex: 0,
        value: "2022-08-24"
      },
      {
        offenceIndex: 3,
        resultIndex: 0,
        value: "2022-07-24"
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
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
          .NextHearingDate
      ).toBeUndefined()
    })

    amendNextHearingDate(amendments, aho)

    amendments.forEach(({ offenceIndex, resultIndex, value }) => {
      const actualNextHearingDate =
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
          .NextHearingDate

      expect(actualNextHearingDate).toEqual(value)
    })
  })

  it("amend valid next hearing date for multiple results on an offence", () => {
    const amendments = [
      {
        offenceIndex: 0,
        resultIndex: 0,
        value: "2022-08-24"
      },
      {
        offenceIndex: 3,
        resultIndex: 1,
        value: "2022-07-24"
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
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
          .NextHearingDate
      ).toBeUndefined()
    })

    amendNextHearingDate(amendments, aho)

    amendments.forEach(({ offenceIndex, resultIndex, value }) => {
      const actualNextHearingDate =
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
          .NextHearingDate

      expect(actualNextHearingDate).toEqual(value)
    })
  })
})
