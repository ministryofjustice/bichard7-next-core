import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import cloneDeep from "lodash.clonedeep"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import {
  default as amendOffenceCourtCaseReferenceNumber,
  default as amendOffenceReasonSequence
} from "./amendOffenceCourtCaseReferenceNumber"

describe("amend offence court case reference", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("amends offence ccr to aho", () => {
    const offenceIndex = 3

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    amendOffenceReasonSequence(
      [
        {
          offenceIndex,
          value: "TEST/CCR"
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].CourtCaseReferenceNumber
    ).toEqual("TEST/CCR")
    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualCourtCaseReference
    ).toBe(true)
  })

  it("amends ccr on multiple offences", () => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    const amendments = [
      {
        offenceIndex: 0,
        value: "TEST/CCR/1"
      },
      {
        offenceIndex: 1,
        value: "TEST/CCR/2"
      },
      {
        offenceIndex: 2,
        value: "TEST/CCR/3"
      }
    ]

    amendOffenceCourtCaseReferenceNumber(amendments, aho)

    amendments.forEach(({ value, offenceIndex }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].CourtCaseReferenceNumber
      ).toEqual(value)
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualCourtCaseReference
      ).toBe(true)
    })
  })
})
