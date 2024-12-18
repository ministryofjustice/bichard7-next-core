import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import type { PncQueryResult } from "../../../types/PncQueryResult"

import generateAhoFromOffenceList from "../../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import ResultClass from "../../../types/ResultClass"
import createDisposalsFromOffence from "./createDisposalsFromOffence"

const generateResult = (
  pncDisposalType: number,
  resultCode: number,
  resultClass: ResultClass,
  numberOfExpectedDisposals: 1 | 2,
  index: number
): Result => ({
  PNCDisposalType: pncDisposalType,
  CJSresultCode: resultCode,
  ResultClass: resultClass,
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
      DurationLength: index,
      DurationType: ""
    },
    {
      DurationUnit: "Y",
      DurationLength: index,
      DurationType: ""
    },
    {
      DurationUnit: "Y",
      DurationLength: index,
      DurationType: ""
    }
  ].slice(0, numberOfExpectedDisposals === 1 ? 1 : undefined)
})

const generateAho = (
  results: {
    numberOfExpectedDisposals?: 1 | 2
    pncDisposal: number
    resultClass?: ResultClass
    resultCode?: number
  }[],
  convictionDateFromPncAdjudication = false
) => {
  const aho = generateAhoFromOffenceList([
    {
      Result: results.map((result, resultIndex) =>
        generateResult(
          result.pncDisposal,
          result.resultCode ?? result.pncDisposal,
          result.resultClass ?? ResultClass.SENTENCE,
          result.numberOfExpectedDisposals ?? 1,
          resultIndex
        )
      ),
      CriminalProsecutionReference: {
        OffenceReasonSequence: "001"
      },
      CourtCaseReferenceNumber: "FOO"
    } as Offence
  ])

  if (convictionDateFromPncAdjudication) {
    aho.PncQuery = {
      courtCases: [
        {
          courtCaseReference:
            aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber,
          offences: [
            {
              offence: {
                sequenceNumber: 1
              },
              disposals: [{ type: 2007 }],
              adjudication: {
                sentenceDate: new Date("2024-12-05")
              }
            }
          ]
        }
      ]
    } as unknown as PncQueryResult
  } else {
    aho.PncQuery = undefined
  }

  return [aho, aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]] as const
}

describe("createDisposalsFromOffence", () => {
  it("should return empty array if there are no results", () => {
    const [aho, offence] = generateAho([])

    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toHaveLength(0)
  })

  it("should return empty array if there are no recordable results", () => {
    const [aho, offence] = generateAho([{ pncDisposal: 1000 }, { pncDisposal: 1000 }])

    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toHaveLength(0)
  })

  it("should return disposals when all PNC disposals are 2007", () => {
    const [aho, offence] = generateAho([{ pncDisposal: 2007 }, { pncDisposal: 2007 }])

    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toMatchSnapshot()
  })

  it("should ignore disposals before the first result with PNC disposal 2060 when a disposal 2050 has been found and 2 disposals are generated already", () => {
    const [aho, offence] = generateAho([
      { pncDisposal: 2050, numberOfExpectedDisposals: 2 },
      { pncDisposal: 2060, numberOfExpectedDisposals: 2 },
      { pncDisposal: 2066, numberOfExpectedDisposals: 2 },
      { pncDisposal: 2060, numberOfExpectedDisposals: 1 }
    ])
    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toMatchSnapshot()
  })

  it("should not ignore disposals before the first result with PNC disposal 2060 when a disposal 2050 has been found but 3 disposals are generated already", () => {
    const [aho, offence] = generateAho([
      { pncDisposal: 2050, numberOfExpectedDisposals: 2 },
      { pncDisposal: 2050, numberOfExpectedDisposals: 1 },
      { pncDisposal: 2060, numberOfExpectedDisposals: 2 }
    ])
    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toMatchSnapshot()
  })

  it("should ignore disposals before the first result with PNC disposal 2060 when a disposal 2063 has been found and 2 disposals are generated already", () => {
    const [aho, offence] = generateAho([
      { pncDisposal: 2051, numberOfExpectedDisposals: 1 },
      { pncDisposal: 2060, numberOfExpectedDisposals: 1 },
      { pncDisposal: 2063, numberOfExpectedDisposals: 1 },
      { pncDisposal: 2068, numberOfExpectedDisposals: 1 }
    ])
    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toMatchSnapshot()
  })

  it("should ignore disposals before the first result with PNC disposal 2060 when a disposal 2063 with result 2060 has been found and 2 disposals are generated already", () => {
    const [aho, offence] = generateAho([
      { pncDisposal: 2051, numberOfExpectedDisposals: 1 },
      { pncDisposal: 2063, resultCode: 2060, numberOfExpectedDisposals: 1 },
      { pncDisposal: 2063, numberOfExpectedDisposals: 1 },
      { pncDisposal: 2068, numberOfExpectedDisposals: 1 }
    ])
    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toMatchSnapshot()
  })

  it("should ignore disposal 2063 when there was a disposal 2063 with result code 2060", () => {
    const [aho, offence] = generateAho([{ pncDisposal: 2063, resultCode: 2060 }, { pncDisposal: 2063 }])

    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toMatchSnapshot()
  })

  it("should not add any disposal when disposal codes are 3052 and adjournment does not exist", () => {
    const [aho, offence] = generateAho([
      { pncDisposal: 3052, resultClass: ResultClass.ADJOURNMENT },
      { pncDisposal: 3052, resultClass: ResultClass.ADJOURNMENT }
    ])

    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toHaveLength(0)
  })

  it("should generate a PNC disposal using the sentence date from the matching offence when adjournment does not exist and disposal 3027 does not exist", () => {
    const [aho, offence] = generateAho([{ pncDisposal: 2050, resultClass: ResultClass.SENTENCE }], true)

    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toMatchSnapshot()
  })

  it("should generate a PNC disposal using the sentence date from the matching offence when adjournment exists", () => {
    const [aho, offence] = generateAho([{ pncDisposal: 2050, resultClass: ResultClass.ADJOURNMENT }], true)

    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toMatchSnapshot()
  })

  it("should generate a PNC disposal using the sentence date from the matching offence when disposal 3027 exists", () => {
    const [aho, offence] = generateAho([{ pncDisposal: 3027, resultClass: ResultClass.SENTENCE }], true)

    const disposals = createDisposalsFromOffence(aho, offence)

    expect(disposals).toMatchSnapshot()
  })
})