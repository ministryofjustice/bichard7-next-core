import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import cloneDeep from "lodash.clonedeep"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendNextReasonSourceOrganisation from "./amendNextResultSourceOrganisation"

describe("amend next result source organisation", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("sets on defendant the next result source organisation", () => {
    const offenceIndex = -1
    const resultIndex = 0
    const value = "RANDOM_TEST_STRING"

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextResultSourceOrganisation).toBe(
      undefined
    )

    amendNextReasonSourceOrganisation([{ offenceIndex, resultIndex, value }], aho)

    const actualOrganisationUnitCode =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextResultSourceOrganisation

    expect(actualOrganisationUnitCode?.OrganisationUnitCode).toBe(value)
    expect(actualOrganisationUnitCode?.TopLevelCode).toBe(value.substring(0, 1))
    expect(actualOrganisationUnitCode?.SecondLevelCode).toBe(value.substring(1, 3))
    expect(actualOrganisationUnitCode?.ThirdLevelCode).toBe(value.substring(3, 5))
    expect(actualOrganisationUnitCode?.BottomLevelCode).toBe(value.substring(5, 6))
  })

  it("sets the ou codes as null (no TopLevelCode property) when the incoming value length is 0", () => {
    const offenceIndex = -1
    const resultIndex = 0
    const value = ""

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextResultSourceOrganisation).toBe(
      undefined
    )

    amendNextReasonSourceOrganisation([{ offenceIndex, resultIndex, value }], aho)

    const actualOrganisationUnitCode =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextResultSourceOrganisation

    expect(actualOrganisationUnitCode?.OrganisationUnitCode).toBe(value)
    expect(actualOrganisationUnitCode?.TopLevelCode).toBe(undefined)
    expect(actualOrganisationUnitCode?.SecondLevelCode).toBe(null)
    expect(actualOrganisationUnitCode?.ThirdLevelCode).toBe(null)
    expect(actualOrganisationUnitCode?.BottomLevelCode).toBe(null)
  })

  it("sets on offence the next result source organisation", () => {
    const offenceIndex = 2
    const resultIndex = 0
    const value = "RANDOM_TEST_STRING"

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
        .NextResultSourceOrganisation
    ).toBe(undefined)

    amendNextReasonSourceOrganisation([{ offenceIndex, resultIndex, value }], aho)

    const actualOrganisationUnitCode =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
        ?.NextResultSourceOrganisation

    expect(actualOrganisationUnitCode?.OrganisationUnitCode).toBe(value)
    expect(actualOrganisationUnitCode?.TopLevelCode).toBe(value.substring(0, 1))
    expect(actualOrganisationUnitCode?.SecondLevelCode).toBe(value.substring(1, 3))
    expect(actualOrganisationUnitCode?.ThirdLevelCode).toBe(value.substring(3, 5))
    expect(actualOrganisationUnitCode?.BottomLevelCode).toBe(value.substring(5, 6))
  })

  it("throws an error if the defendant result is undefined", () => {
    const offenceIndex = -1
    const resultIndex = 0
    const value = "RANDOM_TEST_STRING"

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result = undefined

    expect(() => amendNextReasonSourceOrganisation([{ offenceIndex, resultIndex, value }], aho)).toThrowError(
      "Cannot update the NextResultSourceOrganisation; Result in undefined"
    )
  })

  it("throws an error if the offence index is out of range", () => {
    const offenceIndex = 6
    const resultIndex = 0
    const value = "RANDOM_TEST_STRING"

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]
    expect(() => amendNextReasonSourceOrganisation([{ offenceIndex, resultIndex, value }], aho)).toThrowError(
      `Cannot update the NextResultSourceOrganisation; Offence index is out of range`
    )
  })

  it("throws an error if the result index is out of range", () => {
    const offenceIndex = 0
    const resultIndex = 4
    const value = "RANDOM_TEST_STRING"

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]
    expect(() => amendNextReasonSourceOrganisation([{ offenceIndex, resultIndex, value }], aho)).toThrowError(
      `Cannot update NextResultSourceOrganisation; Result index on Offence is out of range`
    )
  })

  it("sets the next result source organisation on multiple offences", () => {
    const amendments = [
      {
        offenceIndex: 2,
        resultIndex: 0,
        value: "RANDOM_TEST_STRING_2"
      },
      {
        offenceIndex: 0,
        resultIndex: 0,
        value: "RANDOM_TEST_STRING_0"
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
          .NextResultSourceOrganisation
      ).toBe(undefined)
    })

    amendNextReasonSourceOrganisation(amendments, aho)

    amendments.forEach(({ offenceIndex, resultIndex, value }) => {
      const actualOrganisationUnitCode =
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
          ?.NextResultSourceOrganisation

      expect(actualOrganisationUnitCode?.OrganisationUnitCode).toBe(value)
      expect(actualOrganisationUnitCode?.TopLevelCode).toBe(value.substring(0, 1))
      expect(actualOrganisationUnitCode?.SecondLevelCode).toBe(value.substring(1, 3))
      expect(actualOrganisationUnitCode?.ThirdLevelCode).toBe(value.substring(3, 5))
      expect(actualOrganisationUnitCode?.BottomLevelCode).toBe(value.substring(5, 6))
    })
  })

  it("sets the next result source organisation on multiple results on an offence", () => {
    const amendments = [
      {
        offenceIndex: 0,
        resultIndex: 0,
        value: "RANDOM_TEST_STRING_0"
      },
      {
        offenceIndex: 0,
        resultIndex: 1,
        value: "RANDOM_TEST_STRING_1"
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
          .NextResultSourceOrganisation
      ).toBe(undefined)
    })

    amendNextReasonSourceOrganisation(amendments, aho)

    amendments.forEach(({ offenceIndex, resultIndex, value }) => {
      const actualOrganisationUnitCode =
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
          ?.NextResultSourceOrganisation

      expect(actualOrganisationUnitCode?.OrganisationUnitCode).toBe(value)
      expect(actualOrganisationUnitCode?.TopLevelCode).toBe(value.substring(0, 1))
      expect(actualOrganisationUnitCode?.SecondLevelCode).toBe(value.substring(1, 3))
      expect(actualOrganisationUnitCode?.ThirdLevelCode).toBe(value.substring(3, 5))
      expect(actualOrganisationUnitCode?.BottomLevelCode).toBe(value.substring(5, 6))
    })
  })
})
