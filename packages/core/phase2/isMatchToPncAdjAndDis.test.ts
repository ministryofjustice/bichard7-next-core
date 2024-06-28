import type { PncCourtCaseSummary } from "../comparison/types/MatchingComparisonOutput"
import type { AnnotatedHearingOutcome, Hearing, Offence, Result } from "../types/AnnotatedHearingOutcome"
import type { NonEmptyArray } from "../types/NonEmptyArray"
import type { PncDisposal, PncOffence, PncQueryResult } from "../types/PncQueryResult"
import isMatchToPncAdjAndDis, { allRecordableResultsMatchAPncDisposal } from "./isMatchToPncAdjAndDis"
import generateAhoFromOffenceList from "./tests/fixtures/helpers/generateAhoFromOffenceList"

describe("check isMatchToPncAdjAndDis", () => {
  let aho: AnnotatedHearingOutcome
  let ahoWithResults: AnnotatedHearingOutcome
  let emptyResults: NonEmptyArray<Result>
  let courtCaseResult: Result
  let courtCaseNoOffences: PncCourtCaseSummary

  beforeEach(() => {
    courtCaseNoOffences = {
      courtCaseReference: "FOO",
      offences: []
    }
    aho = generateAhoFromOffenceList([])
    aho.PncQuery = {
      forceStationCode: "06",
      checkName: "",
      pncId: "",
      courtCases: [courtCaseNoOffences]
    }
    emptyResults = [{} as Result]

    courtCaseResult = {
      PNCDisposalType: 2063
    } as Result

    ahoWithResults = generateAhoFromOffenceList([{ Result: [courtCaseResult] } as Offence])
  })

  it("If there is no courtcase ref nr given as input or none exists on the aho, then returns false", () => {
    const result = isMatchToPncAdjAndDis(emptyResults, aho, undefined, 0, undefined)
    expect(result).toBe(false)
  })

  it("If there is are no PNC query courtcases that match the input courtCaseReference, then returns false", () => {
    const result = isMatchToPncAdjAndDis(emptyResults, aho, "DOES_NOT_MATCH_FOO", 0, undefined)
    expect(result).toBe(false)
  })

  it("If there are no offences in the matching courtCase of the PNC Query, then returns false", () => {
    const result = isMatchToPncAdjAndDis(emptyResults, aho, "FOO", 0, undefined)
    expect(result).toBe(false)
  })

  it("If there are no adjudications in the matching courtCase of the PNC Query, then returns false", () => {
    const courtCase: PncCourtCaseSummary = {
      courtCaseReference: "FOO",
      offences: [
        {
          offence: {
            sequenceNumber: 1,
            cjsOffenceCode: "offence-code",
            startDate: new Date("05/22/2024")
          },
          adjudication: {
            sentenceDate: new Date("05/23/2024"),
            verdict: "CONVICTION",
            offenceTICNumber: 0,
            plea: ""
          }
        } as PncOffence
      ]
    }

    ahoWithResults.PncQuery = {
      forceStationCode: "06",
      checkName: "",
      pncId: "",
      courtCases: [courtCase]
    }

    ahoWithResults.AnnotatedHearingOutcome.HearingOutcome.Hearing = {
      DateOfHearing: new Date("05/22/2024")
    } as Hearing

    const result = isMatchToPncAdjAndDis([courtCaseResult] as NonEmptyArray<Result>, ahoWithResults, "FOO", 0, "1")
    expect(result).toBe(false)
  })

  it("returns false if there are matching adjudications but no disposals on the pnc query", () => {
    const courtCase: PncCourtCaseSummary = {
      courtCaseReference: "FOO",
      offences: [
        {
          offence: {
            sequenceNumber: 1,
            cjsOffenceCode: "offence-code",
            startDate: new Date("05/22/2024")
          },
          adjudication: {
            sentenceDate: new Date("05/22/2024"),
            verdict: "NON-CONVICTION",
            offenceTICNumber: 0,
            plea: ""
          }
        } as PncOffence
      ]
    }

    ahoWithResults.PncQuery = {
      forceStationCode: "06",
      checkName: "",
      pncId: "",
      courtCases: [courtCase]
    }

    ahoWithResults.AnnotatedHearingOutcome.HearingOutcome.Hearing = {
      DateOfHearing: new Date("05/22/2024")
    } as Hearing

    const result = isMatchToPncAdjAndDis([courtCaseResult] as NonEmptyArray<Result>, ahoWithResults, "FOO", 0, "1")
    expect(result).toBe(false)
  })

  it("returns true if there are matching adjudications and disposals on the pnc query", () => {
    const courtCaseResult: Result = {
      PNCDisposalType: 2063,
      DateSpecifiedInResult: [
        {
          Date: new Date("05/22/2024"),
          Sequence: 1
        }
      ],
      ResultQualifierVariable: [
        {
          Code: "A"
        }
      ],
      ResultVariableText: "DEFENDANT EXCLUDED FROM LOCATION FOR A PERIOD OF TIME",
      CJSresultCode: 3041,
      AmountSpecifiedInResult: [
        {
          Amount: 25,
          DecimalPlaces: 2
        }
      ],
      SourceOrganisation: {
        OrganisationUnitCode: "",
        TopLevelCode: "",
        SecondLevelCode: "",
        ThirdLevelCode: "",
        BottomLevelCode: ""
      },
      Duration: [
        {
          DurationUnit: "Y",
          DurationLength: 3,
          DurationType: ""
        }
      ]
    }

    ahoWithResults = generateAhoFromOffenceList([{ Result: [courtCaseResult] } as Offence])

    const courtCase: PncCourtCaseSummary = {
      courtCaseReference: "FOO",
      offences: [
        {
          offence: {
            sequenceNumber: 1,
            cjsOffenceCode: "offence-code",
            startDate: new Date("05/22/2024")
          },
          adjudication: {
            sentenceDate: new Date("05/22/2024"),
            verdict: "NON-CONVICTION",
            offenceTICNumber: 0,
            plea: ""
          },
          disposals: [
            {
              type: 2063,
              qtyDate: "22052024",
              qtyDuration: "Y3",
              qtyMonetaryValue: "25",
              qtyUnitsFined: "Y3  220520240000000.0000",
              qualifiers: "A",
              text: "EXCLUDED FROM LOCATION"
            }
          ]
        } as PncOffence
      ]
    }

    const pncQuery: PncQueryResult = {
      forceStationCode: "06",
      checkName: "",
      pncId: "",
      courtCases: [courtCase]
    }

    ahoWithResults.PncQuery = pncQuery
    ahoWithResults.AnnotatedHearingOutcome.HearingOutcome.Hearing = {
      DateOfHearing: new Date("05/22/2024")
    } as Hearing

    const result = isMatchToPncAdjAndDis([courtCaseResult] as NonEmptyArray<Result>, ahoWithResults, "FOO", 0, "001")
    expect(result).toBe(true)
  })
})

describe("check allRecordableResultsMatchAPncDisposal", () => {
  it("Given an unrecordable result, returns true", () => {
    const matchingResult = {
      PNCDisposalType: 2063,
      ResultQualifierVariable: []
    }
    const nonMatchingResult = {
      PNCDisposalType: 2063,
      ResultQualifierVariable: []
    }
    const unrecordableResult = {
      PNCDisposalType: 1000,
      ResultQualifierVariable: []
    }
    const results = [matchingResult, nonMatchingResult, unrecordableResult] as unknown as Result[]
    const aho = generateAhoFromOffenceList([{ Result: results } as Offence])

    const disposals = [
      {
        qtyDate: "",
        qtyDuration: "",
        type: 2063,
        qtyUnitsFined: "",
        qtyMonetaryValue: "",
        qualifiers: "",
        text: ""
      }
    ] as PncDisposal[]

    const result1 = allRecordableResultsMatchAPncDisposal(results, disposals, aho, 0)
    expect(result1).toBe(true)
  })

  it("Given non-matching results, returns false", () => {
    const nonMatchingResult = {
      PNCDisposalType: 2064,
      ResultQualifierVariable: []
    } as unknown as Result

    const results = [nonMatchingResult, nonMatchingResult]
    const aho1 = generateAhoFromOffenceList([{ Result: results } as Offence])

    const disposals = [
      {
        qtyDate: "",
        qtyDuration: "",
        type: 2063,
        qtyUnitsFined: "",
        qtyMonetaryValue: "",
        qualifiers: "",
        text: ""
      }
    ] as PncDisposal[]

    const result = allRecordableResultsMatchAPncDisposal(results, disposals, aho1, 0)
    expect(result).toBe(false)
  })

  it("Given matching results, returns true", () => {
    const matchingResult = {
      PNCDisposalType: 2063,
      ResultQualifierVariable: []
    } as unknown as Result

    const results = [matchingResult, matchingResult]
    const aho1 = generateAhoFromOffenceList([{ Result: results } as Offence])

    const disposals = [
      {
        qtyDate: "",
        qtyDuration: "",
        type: 2063,
        qtyUnitsFined: "",
        qtyMonetaryValue: "",
        qualifiers: "",
        text: ""
      }
    ] as PncDisposal[]

    const result = allRecordableResultsMatchAPncDisposal(results, disposals, aho1, 0)
    expect(result).toBe(true)
  })
})
