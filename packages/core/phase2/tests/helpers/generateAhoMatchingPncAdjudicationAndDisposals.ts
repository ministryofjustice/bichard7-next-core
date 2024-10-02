import type { PncCourtCaseSummary } from "../../../comparison/types/MatchingComparisonOutput"
import type { Hearing, Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import type { PncOffence, PncQueryResult } from "../../../types/PncQueryResult"
import generateAhoFromOffenceList from "../../tests/fixtures/helpers/generateAhoFromOffenceList"

export type GenerateAhoMatchingPncAdjudicationAndDisposalsOptions = {
  hasPncId?: boolean
  hasPncOffences?: boolean
  hasOffences?: boolean
  hasOffenceReasonSequence?: boolean
  hasResults?: boolean
  hasMatchingPncAdjudication?: boolean
  firstResultDisposalType?: number
  firstPncDisposalType?: number
}

const generateResult = (pncDisposalType: number): Result => ({
  PNCDisposalType: pncDisposalType,
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
})

const generateAhoMatchingPncAdjudicationAndDisposals = (
  options: GenerateAhoMatchingPncAdjudicationAndDisposalsOptions
) => {
  const aho = generateAhoFromOffenceList(
    options.hasOffences === false
      ? []
      : [
          {
            Result:
              options.hasResults === false
                ? []
                : [generateResult(options.firstResultDisposalType ?? 2063), generateResult(2064)],
            CriminalProsecutionReference: {
              OffenceReasonSequence: options.hasOffenceReasonSequence === false ? undefined : "001"
            },
            CourtCaseReferenceNumber: "FOO"
          } as Offence
        ]
  )

  const courtCase: PncCourtCaseSummary = {
    courtCaseReference: "FOO",
    offences:
      options.hasPncOffences === false
        ? []
        : [
            {
              offence: {
                sequenceNumber: options.hasMatchingPncAdjudication === false ? 0 : 1,
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
                  type: options.firstPncDisposalType ?? 2063,
                  qtyDate: "22052024",
                  qtyDuration: "Y3",
                  qtyMonetaryValue: "25",
                  qtyUnitsFined: "Y3  220520240000000.0000",
                  qualifiers: "A",
                  text: "EXCLUDED FROM LOCATION"
                },
                {
                  type: 2064,
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

  const pncQuery = {
    forceStationCode: "06",
    checkName: "",
    pncId: options.hasPncId === false ? undefined : "123",
    courtCases: [courtCase]
  } as PncQueryResult

  aho.PncQuery = pncQuery
  aho.AnnotatedHearingOutcome.HearingOutcome.Hearing = {
    DateOfHearing: new Date("05/22/2024")
  } as Hearing

  return aho
}

export default generateAhoMatchingPncAdjudicationAndDisposals
