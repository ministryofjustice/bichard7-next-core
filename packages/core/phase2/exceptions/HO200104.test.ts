import ResultClass from "../../types/ResultClass"
import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import HO200104 from "./HO200104"

type GenerateAhoInput = {
  areAllResultsOnPnc: boolean
  arePncResults2007: "All" | "None" | "One"
  fixedPenalty: boolean
  pncAdjudicationExists: boolean
  resubmitted: boolean
  resultClass: ResultClass
}

const generateAho = ({
  areAllResultsOnPnc,
  arePncResults2007,
  fixedPenalty,
  pncAdjudicationExists,
  resubmitted,
  resultClass
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
  offence.Result[0].ResultClass = resultClass

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
  { areAllResultsOnPnc: true, arePncResults2007: "All", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "One", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "None", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "All", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "One", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "None", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "All", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "One", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "None", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "All", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "One", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "None", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "All", fixedPenalty: false, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "One", fixedPenalty: false, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "None", fixedPenalty: false, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "All", fixedPenalty: false, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "One", fixedPenalty: false, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "None", fixedPenalty: false, pncAdjudicationExists: true, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "All", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "One", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "None", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "All", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "One", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: false, arePncResults2007: "None", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: true },
  { areAllResultsOnPnc: true, arePncResults2007: "All", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "One", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "None", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: false },
  { areAllResultsOnPnc: false, arePncResults2007: "All", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: false },
  { areAllResultsOnPnc: false, arePncResults2007: "One", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: false },
  { areAllResultsOnPnc: false, arePncResults2007: "None", fixedPenalty: true, pncAdjudicationExists: true, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "All", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "One", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "None", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: false, arePncResults2007: "All", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: false, arePncResults2007: "One", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: false, arePncResults2007: "None", fixedPenalty: true, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "All", fixedPenalty: false, pncAdjudicationExists: true, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "One", fixedPenalty: false, pncAdjudicationExists: true, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "None", fixedPenalty: false, pncAdjudicationExists: true, resubmitted: false },
  { areAllResultsOnPnc: false, arePncResults2007: "All", fixedPenalty: false, pncAdjudicationExists: true, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "All", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "One", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: true, arePncResults2007: "None", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: false, arePncResults2007: "All", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: false, arePncResults2007: "One", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: false },
  { areAllResultsOnPnc: false, arePncResults2007: "None", fixedPenalty: false, pncAdjudicationExists: false, resubmitted: false }
]

describe("HO200104", () => {
  describe("when result class is judgement with final result", () => {
    it("should return exception when there is no fixed penalty, PNC adjudication exists, results are not 2007 and are not on PNC", () => {
      const aho = generateAho({
        areAllResultsOnPnc: false,
        arePncResults2007: "None",
        fixedPenalty: false,
        pncAdjudicationExists: true,
        resubmitted: false,
        resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT
      })

      const exceptions = HO200104(aho)

      expect(exceptions).toEqual([
        {
          code: "HO200104",
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
        areAllResultsOnPnc: false,
        arePncResults2007: "None",
        fixedPenalty: false,
        pncAdjudicationExists: true,
        resubmitted: false,
        resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT
      })

      const exceptions = HO200104(aho)

      expect(exceptions).toEqual([
        {
          code: "HO200104",
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
        testInput.resultClass = ResultClass.JUDGEMENT_WITH_FINAL_RESULT
        const aho = generateAho(testInput as GenerateAhoInput)

        const exceptions = HO200104(aho)

        expect(exceptions).toHaveLength(0)
      })
    })
  })

  describe("when result class is sentence", () => {
    it("should return exception when there is no fixed penalty, PNC adjudication exists, results are not on PNC, and there is a 2007 PNC result", () => {
      const aho = generateAho({
        areAllResultsOnPnc: false,
        arePncResults2007: "One",
        fixedPenalty: false,
        pncAdjudicationExists: true,
        resubmitted: false,
        resultClass: ResultClass.SENTENCE
      })

      const exceptions = HO200104(aho)

      expect(exceptions).toEqual([
        {
          code: "HO200104",
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
        testInput.resultClass = ResultClass.SENTENCE
        const aho = generateAho(testInput as GenerateAhoInput)

        const exceptions = HO200104(aho)

        expect(exceptions).toHaveLength(0)
      })
    })
  })
})
