export type ResolutionReasonKey =
  | "NonRecordable"
  | "PNCRecordIsAccurate"
  | "Reallocated"
  | "UpdatedDisposal"
  | "UpdatedDisposalAndRemand"
  | "UpdatedRemand"

export const ResolutionReasons: Record<ResolutionReasonKey, string> = {
  NonRecordable: "Hearing outcome is non-recordable - no PNC update required",
  PNCRecordIsAccurate: "PNC record already has accurate results",
  Reallocated: "Passed to another force/area/prosecutor/dept (specify below)",
  UpdatedDisposal: "Updated disposal(s) manually on PNC",
  UpdatedDisposalAndRemand: "Updated disposal(s) and remand(s) manually on PNC",
  UpdatedRemand: "Updated remand(s) manually on PNC"
}

export const ResolutionReasonCode: Record<ResolutionReasonKey, number> = {
  NonRecordable: 9,
  PNCRecordIsAccurate: 5,
  Reallocated: 10,
  UpdatedDisposal: 2,
  UpdatedDisposalAndRemand: 4,
  UpdatedRemand: 3
}

export type ManualResolution = {
  reason: keyof typeof ResolutionReasons
  reasonText?: string
}
