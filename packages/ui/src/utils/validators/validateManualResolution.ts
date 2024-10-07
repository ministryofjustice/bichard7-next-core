import { ManualResolution } from "types/ManualResolution"

export const validateManualResolution = (manualResolution: ManualResolution): { valid: boolean; error?: string } => {
  if (manualResolution.reason === "Reallocated" && !manualResolution.reasonText) {
    return { valid: false, error: "Reason text is required" }
  }

  return { valid: true }
}
