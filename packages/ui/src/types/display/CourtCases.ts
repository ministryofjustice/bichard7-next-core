import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type CourtCase from "services/entities/CourtCase"

import type { DisplayNote } from "./Notes"
import type { DisplayTrigger } from "./Triggers"

type FieldsForDisplayPartialCourtCase =
  | "asn"
  | "courtName"
  | "defendantName"
  | "errorId"
  | "errorLockedByUsername"
  | "errorReport"
  | "errorStatus"
  | "isUrgent"
  | "ptiurn"
  | "triggerCount"
  | "triggerLockedByUsername"
  | "triggerStatus"

export type DisplayPartialCourtCase = {
  canUserEditExceptions: boolean
  courtDate?: string
  errorLockedByUserFullName?: string
  notes: DisplayNote[]
  resolutionTimestamp: null | string
  triggerLockedByUserFullName?: string
  triggers: DisplayTrigger[]
} & Pick<CourtCase, FieldsForDisplayPartialCourtCase>

type FieldsForDisplayFullCourtCase =
  | "courtCode"
  | "courtReference"
  | "orgForPoliceFilter"
  | FieldsForDisplayPartialCourtCase

export type DisplayFullCourtCase = {
  aho: AnnotatedHearingOutcome
  phase?: null | number
  updatedHearingOutcome: AnnotatedHearingOutcome
} & DisplayPartialCourtCase &
  Pick<CourtCase, FieldsForDisplayFullCourtCase>
