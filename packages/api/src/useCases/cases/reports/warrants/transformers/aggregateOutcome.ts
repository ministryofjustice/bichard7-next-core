import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import type { NextHearingDetails } from "../extractionUtils/findNextHearing"

import { findNextHearing } from "../extractionUtils/findNextHearing"
import { analyzeResult } from "./analyzeResult"

interface AggregatedOutcome {
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

export const aggregateOutcome = (results: Result[]): AggregatedOutcome => {
  // Initialize State
  const acc: AggregatedOutcome = {
    flags: {
      bail: false,
      firstInstance: false,
      noBail: false,
      parentResult: false,
      witnessResult: false
    },
    nextHearings: [],
    warrantResultText: undefined,
    withdrawnResultText: undefined
  }

  const uniqueHearingKeys = new Set<string>()

  for (const result of results) {
    // A. Analyse Flags & Text
    // We reuse the analyzeResult logic but apply it immediately
    const analysis = analyzeResult(result)

    if (analysis.parentResult) {
      acc.flags.parentResult = true
    }

    if (analysis.witnessResult) {
      acc.flags.witnessResult = true
    }

    if (analysis.bail) {
      acc.flags.bail = true
    }

    if (analysis.noBail) {
      acc.flags.noBail = true
    }

    if (analysis.firstInstance) {
      acc.flags.firstInstance = true
    }

    // Capture text (First found wins)
    if (!acc.warrantResultText && analysis.warrantResultText) {
      acc.warrantResultText = analysis.warrantResultText
    }

    if (!acc.withdrawnResultText && analysis.withdrawnResultText) {
      acc.withdrawnResultText = analysis.withdrawnResultText
    }

    // B. Extract Next Hearing
    const hearing = findNextHearing(result)
    if (hearing && !uniqueHearingKeys.has(hearing.uniqueKey)) {
      uniqueHearingKeys.add(hearing.uniqueKey)
      acc.nextHearings.push(hearing)
    }
  }

  return acc
}
