import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import type { NextHearingDetails } from "../utils/findNextHearing"

import { findNextHearing } from "../utils/findNextHearing"
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

const updateFlags = (acc: AggregatedOutcome, result: Result) => {
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
}

export const aggregateOutcome = (results: Result[]): AggregatedOutcome => {
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
    updateFlags(acc, result)

    const hearing = findNextHearing(result)
    if (hearing && !uniqueHearingKeys.has(hearing.uniqueKey)) {
      uniqueHearingKeys.add(hearing.uniqueKey)
      acc.nextHearings.push(hearing)
    }
  }

  return acc
}
