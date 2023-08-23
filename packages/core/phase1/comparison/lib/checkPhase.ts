import type {
  Comparison,
  OldPhase1Comparison,
  Phase1Comparison,
  Phase2Comparison,
  Phase3Comparison
} from "phase1/comparison/types/ComparisonFile"

export const isPhase1 = (comparison: Comparison): comparison is OldPhase1Comparison | Phase1Comparison =>
  !("phase" in comparison) || comparison.phase === 1

export const isPhase2 = (comparison: Comparison): comparison is Phase2Comparison =>
  "phase" in comparison && comparison.phase === 2

export const isPhase3 = (comparison: Comparison): comparison is Phase3Comparison =>
  "phase" in comparison && comparison.phase === 3
