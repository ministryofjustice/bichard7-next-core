import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import CourtCase from "services/entities/CourtCase"
import { DisplayNote } from "./Notes"
import { DisplayTrigger } from "./Triggers"

type FieldsForDisplayPartialCourtCase =
  | "asn"
  | "courtName"
  | "errorId"
  | "errorLockedByUsername"
  | "errorStatus"
  | "errorReport"
  | "isUrgent"
  | "ptiurn"
  | "triggerLockedByUsername"
  | "triggerCount"
  | "triggerStatus"
  | "defendantName"

export type DisplayPartialCourtCase = Pick<CourtCase, FieldsForDisplayPartialCourtCase> & {
  courtDate?: string
  errorLockedByUserFullName?: string
  canUserEditExceptions: boolean
  triggerLockedByUserFullName?: string
  notes: DisplayNote[]
  triggers: DisplayTrigger[]
  resolutionTimestamp: string | null
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
