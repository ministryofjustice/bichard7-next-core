export const ResolutionStatus = {
  Resolved: "Resolved",
  Submitted: "Submitted",
  Unresolved: "Unresolved"
} as const

export enum ResolutionStatusNumber {
  Resolved = 2,
  Submitted = 3,
  Unresolved = 1
}

export type ResolutionStatus = (typeof ResolutionStatus)[keyof typeof ResolutionStatus]
