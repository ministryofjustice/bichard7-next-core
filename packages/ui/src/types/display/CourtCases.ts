import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type CourtCase from "services/entities/CourtCase"
import type { DisplayNote } from "./Notes"
import type { DisplayTrigger } from "./Triggers"

type FieldsForDisplayPartialCourtCase =
  | "asn"
  | "courtName"
  | "errorId"
  | "errorLockedByUsername"
  | "errorStatus"
  | "errorReport"
  | "errorQualityChecked"
  | "isUrgent"
  | "ptiurn"
  | "triggerLockedByUsername"
  | "triggerCount"
  | "triggerStatus"
  | "triggerQualityChecked"
  | "defendantName"

export type DisplayPartialCourtCase = Pick<CourtCase, FieldsForDisplayPartialCourtCase> & {
  courtDate?: string
  errorLockedByUserFullName?: string
  canUserEditExceptions: boolean
  triggerLockedByUserFullName?: string
  notes: DisplayNote[]
  triggers: DisplayTrigger[]
  resolutionTimestamp: string | null
  noteCount?: number
  messageReceivedTimestamp: string
}

type FieldsForDisplayFullCourtCase =
  | FieldsForDisplayPartialCourtCase
  | "orgForPoliceFilter"
  | "courtCode"
  | "courtReference"

export type DisplayFullCourtCase = Pick<CourtCase, FieldsForDisplayFullCourtCase> &
  DisplayPartialCourtCase & {
    phase?: number | null
    aho: AnnotatedHearingOutcome
    updatedHearingOutcome: AnnotatedHearingOutcome
  }
