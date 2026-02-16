import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { findNextHearing, type NextHearingDetails } from "../extractionUtils/findNextHearing"
import { analyzeResult } from "./analyzeResult"

interface OffenceResultsAnalysis {
  flags: {
    bail: boolean
    firstInstance: boolean
    noBail: boolean
    parentResult: boolean
    witnessResult: boolean
  }
  nextHearings: NextHearingDetails[]
  warrantResultText?: string
  withdrawnResultText?: string
}

export const processResults = (results: Result[]): OffenceResultsAnalysis => {
  const output: OffenceResultsAnalysis = {
    flags: {
      bail: false,
      firstInstance: false,
      noBail: false,
      parentResult: false,
      witnessResult: false
    },
    nextHearings: []
  }

  for (const result of results) {
    const analysis = analyzeResult(result)

    if (analysis.parentResult) {
      output.flags.parentResult = true
    }

    if (analysis.witnessResult) {
      output.flags.witnessResult = true
    }

    if (analysis.bail) {
      output.flags.bail = true
    }

    if (analysis.noBail) {
      output.flags.noBail = true
    }

    if (analysis.firstInstance) {
      output.flags.firstInstance = true
    }

    // Capture text (First one found wins for this batch)
    if (!output.warrantResultText && analysis.warrantResultText) {
      output.warrantResultText = analysis.warrantResultText
    }

    if (!output.withdrawnResultText && analysis.withdrawnResultText) {
      output.withdrawnResultText = analysis.withdrawnResultText
    }

    const nextHearing = findNextHearing(result)
    if (nextHearing) {
      output.nextHearings.push(nextHearing)
    }
  }

  return output
}
