export interface BailStatusInputs {
  bail: boolean
  hasNextCourtAppearance: boolean
  noBail: boolean
  tRPR0002Present: boolean
  tRPR0012Present: boolean
}

export const calculateBailStatus = (inputs: BailStatusInputs): string => {
  // Logic: If Trigger 12 is present but Trigger 2 is NOT, return empty
  if (inputs.tRPR0012Present && !inputs.tRPR0002Present) {
    return ""
  }

  if (inputs.bail) {
    return "Bail"
  }

  if (inputs.noBail) {
    return "No Bail"
  }

  if (inputs.hasNextCourtAppearance) {
    return "Bail"
  }

  // Default fallback
  return "No Bail"
}
