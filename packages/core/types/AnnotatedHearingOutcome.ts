import type { z } from "zod"

import type {
  addressSchema,
  amountSpecifiedInResultSchema,
  caseSchema,
  criminalProsecutionReferenceSchema,
  dateSpecifiedInResultSchema,
  defendantDetailSchema,
  defendantOrOffenderSchema,
  durationSchema,
  hearingDefendantSchema,
  hearingOutcomeSchema,
  hearingSchema,
  localOffenceCodeSchema,
  numberSpecifiedInResultSchema,
  offenceCodeSchema,
  offenceReasonSchema,
  offenceSchema,
  organisationUnitSchema,
  resultQualifierVariableSchema,
  resultSchema,
  urgentSchema
} from "../schemas/unvalidatedHearingOutcome"
import type { unvalidatedHearingOutcomeSchema } from "../schemas/unvalidatedHearingOutcome"

export type Address = z.infer<typeof addressSchema>
export type AmountSpecifiedInResult = z.infer<typeof amountSpecifiedInResultSchema>
export type AnnotatedHearingOutcome = z.infer<typeof unvalidatedHearingOutcomeSchema>
export type Case = z.infer<typeof caseSchema>
export type CriminalProsecutionReference = z.infer<typeof criminalProsecutionReferenceSchema>
export type DateSpecifiedInResult = z.infer<typeof dateSpecifiedInResultSchema>
export type DefendantDetail = z.infer<typeof defendantDetailSchema>
export type DefendantOrOffender = z.infer<typeof defendantOrOffenderSchema>
export type Duration = z.infer<typeof durationSchema>
export type Hearing = z.infer<typeof hearingSchema>
export type HearingDefendant = z.infer<typeof hearingDefendantSchema>
export type HearingOutcome = z.infer<typeof hearingOutcomeSchema>
export type LocalOffenceCode = z.infer<typeof localOffenceCodeSchema>
export type NumberSpecifiedInResult = z.infer<typeof numberSpecifiedInResultSchema>
export type Offence = z.infer<typeof offenceSchema>
export type OffenceCode = z.infer<typeof offenceCodeSchema>
export type OffenceReason = z.infer<typeof offenceReasonSchema>
export type OrganisationUnitCodes = z.infer<typeof organisationUnitSchema>
export type Result = z.infer<typeof resultSchema>
export type ResultQualifierVariable = z.infer<typeof resultQualifierVariableSchema>
export type Urgent = z.infer<typeof urgentSchema>
