export const ResolutionStatus = {
  Resolved: "Resolved",
  Submitted: "Submitted",
  Unresolved: "Unresolved"
} as const

export const ResolutionStatusNumber = {
  Resolved: 2,
  Submitted: 3,
  Unresolved: 1
} as const

export type ResolutionStatus = (typeof ResolutionStatus)[keyof typeof ResolutionStatus]
