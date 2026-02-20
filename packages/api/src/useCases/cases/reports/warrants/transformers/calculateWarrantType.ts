export interface WarrantTypeInputs {
  firstInstance: boolean
  parentResult: boolean
  tRPR0002Present: boolean
  tRPR0012Present: boolean
  witnessResult: boolean
}

export const calculateWarrantType = (inputs: WarrantTypeInputs): string => {
  const parts: string[] = []

  // Special case: Mixed triggers 12 & 2
  if (inputs.tRPR0012Present && inputs.tRPR0002Present) {
    parts.push("Withdrawn")
  }

  // Prioritisation Chain
  if (inputs.parentResult) {
    parts.push("Parent")
  } else if (inputs.witnessResult) {
    parts.push("Witness")
  } else if (inputs.firstInstance) {
    parts.push("First Instance")
  } else if (inputs.tRPR0002Present) {
    parts.push("FTA")
  } else if (inputs.tRPR0012Present) {
    parts.push("Withdrawn")
  } else {
    // Legacy logic appends an empty string here, effectively doing nothing
  }

  // Join with newlines to handle cases where multiple types might be appended
  // (although the simplified logic mostly yields one)
  return parts.join("\n")
}
