import type {
  AnnotatedHearingOutcome,
  Offence,
  Result,
  ResultQualifierVariable
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import cloneDeep from "lodash.clonedeep"
import amendAsn from "utils/amendments/amendAsn"
import amendCourtCaseReference from "utils/amendments/amendCourtCaseReference"
import amendCourtOffenceSequenceNumber from "utils/amendments/amendCourtOffenceSequenceNumber"
import amendCourtReference from "utils/amendments/amendCourtReference"
import amendForceOwner from "utils/amendments/amendForceOwner"
import amendNextHearingDate from "utils/amendments/amendNextHearingDate"
import amendNextResultSourceOrganisation from "utils/amendments/amendNextResultSourceOrganisation"
import amendOffenceReasonSequence from "utils/amendments/amendOffenceReasonSequence"
import amendResultQualifierCode from "utils/amendments/amendResultQualifierCode"
import amendResultVariableText from "utils/amendments/amendResultVariableText"
import removeEmptyResultQualifierVariable from "utils/removeEmptyResultQualifierVariable"
import applyAmendmentsToAho from "./applyAmendmentsToAho"

import type { Amendments } from "types/Amendments"

jest.mock("utils/amendments/amendAsn/amendAsn")
jest.mock("utils/amendments/amendOffenceReasonSequence/amendOffenceReasonSequence")
jest.mock("utils/amendments/amendCourtCaseReference/amendCourtCaseReference")
jest.mock("utils/amendments/amendResultQualifierCode/amendResultQualifierCode")
jest.mock("utils/amendments/amendNextResultSourceOrganisation/amendNextResultSourceOrganisation")
jest.mock("utils/amendments/amendNextHearingDate/amendNextHearingDate")
jest.mock("utils/amendments/amendResultVariableText/amendResultVariableText")
jest.mock("utils/amendments/amendCourtReference/amendCourtReference")
jest.mock("utils/amendments/amendCourtOffenceSequenceNumber/amendCourtOffenceSequenceNumber")
jest.mock("utils/amendments/amendForceOwner/amendForceOwner")
jest.mock("utils/removeEmptyResultQualifierVariable/removeEmptyResultQualifierVariable")

describe("applyAmendmentsToAho", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence
  let dummyResult: Result
  let dummyResultQualifierVariable: ResultQualifierVariable[]

  beforeEach(() => {
    jest.resetAllMocks()
    dummyResultQualifierVariable = [{ Code: "00XX" }] as ResultQualifierVariable[]

    dummyResult = {
      CJSresultCode: 999,
      ResultQualifierVariable: dummyResultQualifierVariable
    } as Result

    dummyOffence = {
      CriminalProsecutionReference: {
        DefendantOrOffender: {
          DefendantOrOffenderSequenceNumber: "0000"
        },
        OffenceReasonSequence: "0000",
        OffenceReason: { __type: "NationalOffenceReason" }
      },

      Result: [dummyResult]
    } as Offence

    aho = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              ArrestSummonsNumber: "original_value",
              Offence: [dummyOffence],
              Result: dummyResult
            },
            CourtReference: {
              MagistratesCourtReference: "random_magristrates_ref",
              CrownCourtReference: "random_crown_ref"
            }
          }
        }
      }
    } as AnnotatedHearingOutcome
  })

  it("applies Asn amendments to aho", () => {
    const amendments = {
      asn: "1146AA0100000448754E"
    } as Amendments

    applyAmendmentsToAho(amendments, aho)
    expect(amendAsn).toHaveBeenCalledTimes(1)
    expect(amendAsn).toHaveBeenCalledWith(amendments.asn, aho)
  })

  it("applies OffenceReasonSequence amendments to aho", () => {
    const offenceIndex = 3
    const amendments = {
      offenceReasonSequence: [
        {
          offenceIndex,
          value: 1
        }
      ]
    } as Amendments

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    applyAmendmentsToAho(amendments, aho)

    expect(amendOffenceReasonSequence).toHaveBeenCalledTimes(1)
    expect(amendOffenceReasonSequence).toHaveBeenCalledWith(amendments.offenceReasonSequence, aho)
  })

  it("applies CourtCaseReference amendments to aho", () => {
    const offenceIndex = 3
    const amendments = {
      courtCaseReference: [
        {
          offenceIndex,
          value: "newCourtCaseReference"
        }
      ]
    } as Amendments

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    applyAmendmentsToAho(amendments, aho)
    expect(amendCourtCaseReference).toHaveBeenCalledTimes(1)
    expect(amendCourtCaseReference).toHaveBeenCalledWith(amendments.courtCaseReference, aho)
  })

  it("applies ResultQualiferCode amendments to aho", () => {
    const offenceIndex = 0
    const resultIndex = 0
    const amendments = {
      resultQualifierCode: [
        {
          offenceIndex,
          value: "newQualifierCode",
          resultQualifierIndex: 0,
          resultIndex
        }
      ]
    } as Amendments

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    applyAmendmentsToAho(amendments, aho)
    expect(amendResultQualifierCode).toHaveBeenCalledTimes(1)
    expect(amendResultQualifierCode).toHaveBeenCalledWith(amendments.resultQualifierCode, aho)
  })

  it("removes empty ResultQualiferCode from the aho", () => {
    const offenceIndex = 2
    const amendments = {
      resultQualifierCode: [
        {
          offenceIndex,
          value: "",
          resultQualifierIndex: 2,
          resultIndex: 0
        }
      ]
    } as Amendments

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
      amendments.resultQualifierCode?.[0].resultIndex || 0
    ].ResultQualifierVariable = [
      ...dummyResultQualifierVariable,
      ...dummyResultQualifierVariable,
      ...dummyResultQualifierVariable,
      ...dummyResultQualifierVariable
    ]

    applyAmendmentsToAho(amendments, aho)
    expect(removeEmptyResultQualifierVariable).toHaveBeenCalledTimes(1)
    expect(removeEmptyResultQualifierVariable).toHaveBeenCalledWith(aho)
  })

  it("applies NextSourceOrganisation amendments to aho", () => {
    const offenceIndex = 2
    const amendments = {
      nextSourceOrganisation: [
        {
          offenceIndex,
          value: "RANDOM_TEST_STRING",
          resultIndex: 0
        }
      ]
    } as Amendments

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    applyAmendmentsToAho(amendments, aho)
    expect(amendNextResultSourceOrganisation).toHaveBeenCalledTimes(1)
    expect(amendNextResultSourceOrganisation).toHaveBeenCalledWith(amendments.nextSourceOrganisation, aho)
  })

  it("applies NextHearingDate amendments to aho", () => {
    const offenceIndex = 0
    const amendments = {
      nextHearingDate: [
        {
          offenceIndex,
          value: "2022-08-24",
          resultIndex: 0
        }
      ]
    } as Amendments

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    applyAmendmentsToAho(amendments, aho)
    expect(amendNextHearingDate).toHaveBeenCalledTimes(1)
    expect(amendNextHearingDate).toHaveBeenCalledWith(amendments.nextHearingDate, aho)
  })

  it("applies CourtPNCIdentifier amendments to aho", () => {
    const amendments = {
      courtPNCIdentifier: "RANDOM_TEST_STRING"
    } as Amendments

    applyAmendmentsToAho(amendments, aho)
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.CourtPNCIdentifier).toBe(
      amendments.courtPNCIdentifier
    )
  })

  it("applies ResultVariableText amendments to aho", () => {
    const offenceIndex = 0
    const amendments = {
      resultVariableText: [
        {
          offenceIndex,
          value: "random_string",
          resultIndex: 0
        }
      ]
    } as Amendments

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]
    applyAmendmentsToAho(amendments, aho)
    expect(amendResultVariableText).toHaveBeenCalledTimes(1)
    expect(amendResultVariableText).toHaveBeenCalledWith(amendments.resultVariableText, aho)
  })

  it("applies CourtReference amendments to aho", () => {
    const amendments = {
      courtReference: "updated_value"
    } as Amendments

    applyAmendmentsToAho(amendments, aho)
    expect(amendCourtReference).toHaveBeenCalledTimes(1)
    expect(amendCourtReference).toHaveBeenCalledWith(amendments.courtReference, aho)
  })

  it("applies CourtOffenceSequence amendments to aho", () => {
    const offenceIndex = 3
    const amendments = {
      courtOffenceSequenceNumber: [
        {
          offenceIndex,
          value: 1111
        }
      ]
    } as Amendments

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    applyAmendmentsToAho(amendments, aho)
    expect(amendCourtOffenceSequenceNumber).toHaveBeenCalledTimes(1)
    expect(amendCourtOffenceSequenceNumber).toHaveBeenCalledWith(amendments.courtOffenceSequenceNumber, aho)
  })

  it("applies ForceOwner amendments to aho", () => {
    const amendments = {
      forceOwner: "RANDOM_FORCE_OWNER_TEST_STRING"
    } as Amendments

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
      SecondLevelCode: null,
      ThirdLevelCode: null,
      BottomLevelCode: null,
      OrganisationUnitCode: "original_value"
    }

    applyAmendmentsToAho(amendments, aho)
    expect(amendForceOwner).toHaveBeenCalledTimes(1)
    expect(amendForceOwner).toHaveBeenCalledWith(amendments.forceOwner, aho)
  })

  it("applies Force owner amendments to aho", () => {
    const amendments = {
      forceOwner: "RANDOM_FORCE_OWNER_TEST_STRING"
    } as Amendments

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
      SecondLevelCode: null,
      ThirdLevelCode: null,
      BottomLevelCode: null,
      OrganisationUnitCode: "original_value"
    }

    applyAmendmentsToAho(amendments, aho)
    expect(amendForceOwner).toHaveBeenCalledTimes(1)
    expect(amendForceOwner).toHaveBeenCalledWith(amendments.forceOwner, aho)
  })

  it("applies no updates if no amendments have been applied", () => {
    const originalAho = cloneDeep(aho)
    const amendments = {
      noUpdatesResubmit: true
    } as Amendments

    const actualAho = applyAmendmentsToAho(amendments, aho)

    expect(originalAho).toEqual(actualAho)
  })
})
