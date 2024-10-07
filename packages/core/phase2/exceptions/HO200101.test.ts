import ResultClass from "../../types/ResultClass"
import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import HO200101 from "./HO200101"

type GenerateAhoInput = {
  resubmitted: boolean
  fixedPenalty: boolean
  pncAdjudicationExists: boolean
  areAllResultsOnPnc: boolean
  arePncResults2007: "All" | "One" | "None"
}

const generateAho = ({
  resubmitted,
  fixedPenalty,
  pncAdjudicationExists,
  areAllResultsOnPnc,
  arePncResults2007
}: GenerateAhoInput) => {
  const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = fixedPenalty ? "dummy" : undefined
  const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
  offence.Result = [offence.Result[0]]
  offence.Result[0].PNCAdjudicationExists = pncAdjudicationExists
  offence.Result[0].PNCDisposalType = areAllResultsOnPnc
    ? arePncResults2007 === "All"
      ? 2007
      : offence.Result[0].PNCDisposalType
    : 2067
  offence.Result[0].ResultClass = ResultClass.ADJOURNMENT_WITH_JUDGEMENT

  const pncOffence = aho.PncQuery!.courtCases![0].offences[0]
  pncOffence.disposals = [pncOffence.disposals![0]]
  if (arePncResults2007 === "All") {
    pncOffence.disposals![0].type = 2007
  } else if (arePncResults2007 === "One") {
    pncOffence.disposals!.push({ type: 2007 })
  }

  return resubmitted ? { ...structuredClone(aho), PncOperations: [] } : aho
}

// prettier-ignore
const noExceptionScenarios: Partial<GenerateAhoInput>[] = [
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "All" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "One" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "None" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: false, arePncResults2007: "All" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: false, arePncResults2007: "One" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: false, arePncResults2007: "None" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "All" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "One" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "None" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "All" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "One" },
  { resubmitted: true, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "None" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "All" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "One" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "None" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: true, areAllResultsOnPnc: false, arePncResults2007: "All" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: true, areAllResultsOnPnc: false, arePncResults2007: "One" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: true, areAllResultsOnPnc: false, arePncResults2007: "None" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "All" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "One" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "None" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "All" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "One" },
  { resubmitted: true, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "None" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "All" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "One" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "None" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: false, arePncResults2007: "All" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: false, arePncResults2007: "One" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: true, areAllResultsOnPnc: false, arePncResults2007: "None" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "All" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "One" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "None" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "All" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "One" },
  { resubmitted: false, fixedPenalty: true, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "None" },
  { resubmitted: false, fixedPenalty: false, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "All" },
  { resubmitted: false, fixedPenalty: false, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "One" },
  { resubmitted: false, fixedPenalty: false, pncAdjudicationExists: true, areAllResultsOnPnc: true, arePncResults2007: "None" },
  { resubmitted: false, fixedPenalty: false, pncAdjudicationExists: true, areAllResultsOnPnc: false, arePncResults2007: "All" },
  { resubmitted: false, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "All" },
  { resubmitted: false, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "One" },
  { resubmitted: false, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: true, arePncResults2007: "None" },
  { resubmitted: false, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "All" },
  { resubmitted: false, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "One" },
  { resubmitted: false, fixedPenalty: false, pncAdjudicationExists: false, areAllResultsOnPnc: false, arePncResults2007: "None" }
]

describe("HO200101", () => {
  it("should return exception when there is no fixed penalty, PNC adjudication exists, results are not 2007 and are not on PNC", () => {
    const aho = generateAho({
      resubmitted: false,
      fixedPenalty: false,
      pncAdjudicationExists: true,
      areAllResultsOnPnc: false,
      arePncResults2007: "None"
    })

    const exceptions = HO200101(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200101",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultClass"
        ]
      }
    ])
  })

  it("should return exception when there is no fixed penalty, PNC adjudication exists, results are not on PNC, and there is a 2007 PNC result", () => {
    const aho = generateAho({
      resubmitted: false,
      fixedPenalty: false,
      pncAdjudicationExists: true,
      areAllResultsOnPnc: false,
      arePncResults2007: "None"
    })

    const exceptions = HO200101(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200101",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultClass"
        ]
      }
    ])
  })

  noExceptionScenarios.forEach((testInput) => {
    const when = Object.entries(testInput)
      .map(([key, value]) => `${key} is ${value}`)
      .join(", ")

    it(`should not return exception when ${when}`, () => {
      const aho = generateAho(testInput as GenerateAhoInput)
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultClass =
        ResultClass.ADJOURNMENT_WITH_JUDGEMENT

      const exceptions = HO200101(aho)

      expect(exceptions).toHaveLength(0)
    })
  })
})
