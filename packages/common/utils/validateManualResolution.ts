import type { ManualResolution } from "@moj-bichard7/common/types/ManualResolution"

export const validateManualResolution = (manualResolution: ManualResolution): { error?: string; valid: boolean } => {
  if (manualResolution.reason === "Reallocated" && !manualResolution.reasonText) {
    return { error: "Reason text is required", valid: false }
  }

  return { valid: true }
}
