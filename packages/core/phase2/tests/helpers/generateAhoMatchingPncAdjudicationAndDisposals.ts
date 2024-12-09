import type { PncCourtCaseSummary } from "../../../comparison/types/MatchingComparisonOutput"
import type { Hearing, Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import type { PncOffence, PncQueryResult } from "../../../types/PncQueryResult"

import generateAhoFromOffenceList from "../../tests/fixtures/helpers/generateAhoFromOffenceList"

export type GenerateAhoMatchingPncAdjudicationAndDisposalsOptions = {
  firstPncDisposalType?: number
  firstResultDisposalType?: number
  hasAdditionalMatchingOffence?: boolean
  hasMatchingPncAdjudication?: boolean
  hasOffenceReasonSequence?: boolean
  hasOffences?: boolean
  hasPncId?: boolean
  hasPncOffences?: boolean
  hasResults?: boolean
}

const generateResult = (pncDisposalType: number): Result => ({
  PNCDisposalType: pncDisposalType,
  DateSpecifiedInResult: [
    {
      Date: new Date("2024-05-22"),
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

  if (options.hasAdditionalMatchingOffence) {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.push({
      Result: [generateResult(2063)],
      CriminalProsecutionReference: {
        OffenceReasonSequence: "001"
      },
      CourtCaseReferenceNumber: "BAR"
    } as Offence)
  }

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
                startDate: new Date("2024-05-22")
              },
              adjudication: {
                sentenceDate: new Date("2024-05-22"),
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

  if (options.hasAdditionalMatchingOffence) {
    pncQuery.courtCases?.push({
      courtCaseReference: "BAR",
      offences: [
        {
          offence: {
            sequenceNumber: 1,
            cjsOffenceCode: "offence-code",
            startDate: new Date("2024-05-22")
          },
          adjudication: {
            sentenceDate: new Date("2024-05-22"),
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
    })
  }

  aho.PncQuery = pncQuery
  aho.AnnotatedHearingOutcome.HearingOutcome.Hearing = {
    DateOfHearing: new Date("2024-05-22")
  } as Hearing

  return aho
}

export default generateAhoMatchingPncAdjudicationAndDisposals
