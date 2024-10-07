export type ResolutionReasonKey =
  | "UpdatedDisposal"
  | "UpdatedRemand"
  | "UpdatedDisposalAndRemand"
  | "PNCRecordIsAccurate"
  | "NonRecordable"
  | "Reallocated"

export const ResolutionReasons: Record<ResolutionReasonKey, string> = {
  UpdatedDisposal: "Updated disposal(s) manually on PNC",
  UpdatedRemand: "Updated remand(s) manually on PNC",
  UpdatedDisposalAndRemand: "Updated disposal(s) and remand(s) manually on PNC",
  PNCRecordIsAccurate: "PNC record already has accurate results",
  NonRecordable: "Hearing outcome is non-recordable - no PNC update required",
  Reallocated: "Passed to another force/area/prosecutor/dept (specify below)"
}

export const ResolutionReasonCode: Record<ResolutionReasonKey, number> = {
  UpdatedDisposal: 2,
  UpdatedRemand: 3,
  UpdatedDisposalAndRemand: 4,
  PNCRecordIsAccurate: 5,
  NonRecordable: 9,
  Reallocated: 10
}

export type ManualResolution = {
  reason: keyof typeof ResolutionReasons
  reasonText?: string
}
