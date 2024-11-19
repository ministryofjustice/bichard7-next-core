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
  AmountSpecifiedInResult: [
    {
      Amount: 25,
      DecimalPlaces: 2
    }
  ],
  CJSresultCode: 3041,
  DateSpecifiedInResult: [
    {
      Date: new Date("05/22/2024"),
      Sequence: 1
    }
  ],
  Duration: [
    {
      DurationLength: 3,
      DurationType: "",
      DurationUnit: "Y"
    }
  ],
  PNCDisposalType: pncDisposalType,
  ResultQualifierVariable: [
    {
      Code: "A"
    }
  ],
  ResultVariableText: "DEFENDANT EXCLUDED FROM LOCATION FOR A PERIOD OF TIME",
  SourceOrganisation: {
    BottomLevelCode: "",
    OrganisationUnitCode: "",
    SecondLevelCode: "",
    ThirdLevelCode: "",
    TopLevelCode: ""
  }
})

const generateAhoMatchingPncAdjudicationAndDisposals = (
  options: GenerateAhoMatchingPncAdjudicationAndDisposalsOptions
) => {
  const aho = generateAhoFromOffenceList(
    options.hasOffences === false
      ? []
      : [
          {
            CourtCaseReferenceNumber: "FOO",
            CriminalProsecutionReference: {
              OffenceReasonSequence: options.hasOffenceReasonSequence === false ? undefined : "001"
            },
            Result:
              options.hasResults === false
                ? []
                : [generateResult(options.firstResultDisposalType ?? 2063), generateResult(2064)]
          } as Offence
        ]
  )

  if (options.hasAdditionalMatchingOffence) {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.push({
      CourtCaseReferenceNumber: "BAR",
      CriminalProsecutionReference: {
        OffenceReasonSequence: "001"
      },
      Result: [generateResult(2063)]
    } as Offence)
  }

  const courtCase: PncCourtCaseSummary = {
    courtCaseReference: "FOO",
    offences:
      options.hasPncOffences === false
        ? []
        : [
            {
              adjudication: {
                offenceTICNumber: 0,
                plea: "",
                sentenceDate: new Date("05/22/2024"),
                verdict: "NON-CONVICTION"
              },
              disposals: [
                {
                  qtyDate: "22052024",
                  qtyDuration: "Y3",
                  qtyMonetaryValue: "25",
                  qtyUnitsFined: "Y3  220520240000000.0000",
                  qualifiers: "A",
                  text: "EXCLUDED FROM LOCATION",
                  type: options.firstPncDisposalType ?? 2063
                },
                {
                  qtyDate: "22052024",
                  qtyDuration: "Y3",
                  qtyMonetaryValue: "25",
                  qtyUnitsFined: "Y3  220520240000000.0000",
                  qualifiers: "A",
                  text: "EXCLUDED FROM LOCATION",
                  type: 2064
                }
              ],
              offence: {
                cjsOffenceCode: "offence-code",
                sequenceNumber: options.hasMatchingPncAdjudication === false ? 0 : 1,
                startDate: new Date("05/22/2024")
              }
            } as PncOffence
          ]
  }

  const pncQuery = {
    checkName: "",
    courtCases: [courtCase],
    forceStationCode: "06",
    pncId: options.hasPncId === false ? undefined : "123"
  } as PncQueryResult

  if (options.hasAdditionalMatchingOffence) {
    pncQuery.courtCases?.push({
      courtCaseReference: "BAR",
      offences: [
        {
          adjudication: {
            offenceTICNumber: 0,
            plea: "",
            sentenceDate: new Date("05/22/2024"),
            verdict: "NON-CONVICTION"
          },
          disposals: [
            {
              qtyDate: "22052024",
              qtyDuration: "Y3",
              qtyMonetaryValue: "25",
              qtyUnitsFined: "Y3  220520240000000.0000",
              qualifiers: "A",
              text: "EXCLUDED FROM LOCATION",
              type: 2063
            }
          ],
          offence: {
            cjsOffenceCode: "offence-code",
            sequenceNumber: 1,
            startDate: new Date("05/22/2024")
          }
        } as PncOffence
      ]
    })
  }

  aho.PncQuery = pncQuery
  aho.AnnotatedHearingOutcome.HearingOutcome.Hearing = {
    DateOfHearing: new Date("05/22/2024")
  } as Hearing

  return aho
}

export default generateAhoMatchingPncAdjudicationAndDisposals
