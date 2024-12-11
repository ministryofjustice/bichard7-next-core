import type { Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOperation } from "../../../../types/PncOperation"
import type { Operation } from "../../../../types/PncUpdateDataset"

import ResultClass from "../../../../types/ResultClass"
import getResultsForRemand from "./getResultsForRemand"

const createOffence = (options: {
  nextHearingDateMatch?: boolean
  nextResultSourceOrganisation?: boolean
  pncAdjudicationExists?: boolean
  recordableOffence?: boolean
  recordableResult?: boolean
  resultClass?: ResultClass
}) => ({
  OffenceCategory: options.recordableOffence === false ? "B7" : "ZZ",
  Result: [
    {
      NextHearingDate: options.nextHearingDateMatch === false ? "2024-12-11T10:11:13.000Z" : "2024-12-11T10:11:12.000Z",
      NextResultSourceOrganisation:
        options.nextResultSourceOrganisation === false
          ? {
              TopLevelCode: "A",
              SecondLevelCode: "02",
              ThirdLevelCode: "CJ",
              BottomLevelCode: "00",
              OrganisationUnitCode: "A01CJ00"
            }
          : {
              TopLevelCode: "A",
              SecondLevelCode: "01",
              ThirdLevelCode: "CJ",
              BottomLevelCode: "00",
              OrganisationUnitCode: "A01CJ00"
            },
      PNCDisposalType: options.recordableResult === false ? 1000 : 2051,
      PNCAdjudicationExists: options.pncAdjudicationExists ?? true,
      ResultClass: options.resultClass ?? ResultClass.ADJOURNMENT_POST_JUDGEMENT
    }
  ] as Result[]
})

const operation = {
  code: "NEWREM",
  data: {
    nextHearingDate: new Date("2024-12-11T10:11:12.000Z"),
    nextHearingLocation: {
      TopLevelCode: "A",
      SecondLevelCode: "01",
      ThirdLevelCode: "CJ",
      BottomLevelCode: "00",
      OrganisationUnitCode: "A01CJ00"
    }
  }
} as Operation<PncOperation.REMAND>

describe("getResultsForRemand", () => {
  it("should not return any results when offence is not recordable", () => {
    const offences = [createOffence({ recordableOffence: false })] as Offence[]

    const results = getResultsForRemand(offences, operation)

    expect(results).toHaveLength(0)
  })

  it("should not return any results when result is not recordable", () => {
    const offences = [createOffence({ recordableResult: false })] as Offence[]

    const results = getResultsForRemand(offences, operation)

    expect(results).toHaveLength(0)
  })

  it("should not return any results when next hearing date does not match the operation data", () => {
    const offences = [createOffence({ nextHearingDateMatch: false })] as Offence[]

    const results = getResultsForRemand(offences, operation)

    expect(results).toHaveLength(0)
  })

  it("should not return any results when next result source organisation does match the operation data", () => {
    const offences = [createOffence({ nextResultSourceOrganisation: false })] as Offence[]

    const results = getResultsForRemand(offences, operation)

    expect(results).toHaveLength(0)
  })

  it("should not return any results when PNC adjudication does not exist and result class is Adjournment post Judgement", () => {
    const offences = [
      createOffence({ pncAdjudicationExists: false, resultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT })
    ] as Offence[]

    const results = getResultsForRemand(offences, operation)

    expect(results).toHaveLength(0)
  })

  it.each([ResultClass.ADJOURNMENT, ResultClass.ADJOURNMENT_PRE_JUDGEMENT])(
    "should not return any results when PNC adjudication exists and result class %s",
    (resultClass) => {
      const offences = [createOffence({ pncAdjudicationExists: true, resultClass })] as Offence[]

      const results = getResultsForRemand(offences, operation)

      expect(results).toHaveLength(0)
    }
  )

  it("should return the matching result", () => {
    const offences = [
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "001"
        },
        Result: [
          {
            NextHearingDate: "2024-12-11T10:11:12.000Z",
            NextResultSourceOrganisation: {
              TopLevelCode: "A",
              SecondLevelCode: "01",
              ThirdLevelCode: "CJ",
              BottomLevelCode: "00",
              OrganisationUnitCode: "A01CJ00"
            },
            PNCDisposalType: 2051,
            PNCAdjudicationExists: true,
            ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT
          }
        ] as Result[]
      },
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "001"
        },
        Result: [
          {
            NextHearingDate: "2024-12-11T10:11:12.000Z",
            NextResultSourceOrganisation: {
              TopLevelCode: "A",
              SecondLevelCode: "01",
              ThirdLevelCode: "CJ",
              BottomLevelCode: "00",
              OrganisationUnitCode: "A01CJ00"
            },
            PNCDisposalType: 2060,
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT
          },
          {
            NextHearingDate: "2024-12-11T10:11:12.000Z",
            NextResultSourceOrganisation: {
              TopLevelCode: "A",
              SecondLevelCode: "01",
              ThirdLevelCode: "CJ",
              BottomLevelCode: "00",
              OrganisationUnitCode: "A01CJ00"
            },
            PNCDisposalType: 2063,
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT
          }
        ] as Result[]
      }
    ] as Offence[]

    const results = getResultsForRemand(offences, operation)

    expect(results).toStrictEqual([
      {
        NextHearingDate: "2024-12-11T10:11:12.000Z",
        NextResultSourceOrganisation: {
          TopLevelCode: "A",
          SecondLevelCode: "01",
          ThirdLevelCode: "CJ",
          BottomLevelCode: "00",
          OrganisationUnitCode: "A01CJ00"
        },
        PNCDisposalType: 2051,
        PNCAdjudicationExists: true,
        ResultClass: "Adjournment with Judgement"
      },
      {
        NextHearingDate: "2024-12-11T10:11:12.000Z",
        NextResultSourceOrganisation: {
          TopLevelCode: "A",
          SecondLevelCode: "01",
          ThirdLevelCode: "CJ",
          BottomLevelCode: "00",
          OrganisationUnitCode: "A01CJ00"
        },
        PNCDisposalType: 2060,
        PNCAdjudicationExists: false,
        ResultClass: "Adjournment with Judgement"
      },
      {
        NextHearingDate: "2024-12-11T10:11:12.000Z",
        NextResultSourceOrganisation: {
          TopLevelCode: "A",
          SecondLevelCode: "01",
          ThirdLevelCode: "CJ",
          BottomLevelCode: "00",
          OrganisationUnitCode: "A01CJ00"
        },
        PNCDisposalType: 2063,
        PNCAdjudicationExists: false,
        ResultClass: "Adjournment pre Judgement"
      }
    ])
  })
})
