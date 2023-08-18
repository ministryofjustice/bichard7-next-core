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
} from "core/phase1/schemas/annotatedHearingOutcome"
import { annotatedHearingOutcomeSchema } from "core/phase1/schemas/annotatedHearingOutcome"
import type { z } from "zod"

export type AnnotatedHearingOutcome = z.infer<typeof annotatedHearingOutcomeSchema>
export type HearingOutcome = z.infer<typeof hearingOutcomeSchema>
export type Case = z.infer<typeof caseSchema>
export type Offence = z.infer<typeof offenceSchema>
export type OffenceReason = z.infer<typeof offenceReasonSchema>
export type OffenceCode = z.infer<typeof offenceCodeSchema>
export type LocalOffenceCode = z.infer<typeof localOffenceCodeSchema>
export type Hearing = z.infer<typeof hearingSchema>
export type Address = z.infer<typeof addressSchema>
export type DefendantDetail = z.infer<typeof defendantDetailSchema>
export type HearingDefendant = z.infer<typeof hearingDefendantSchema>
export type Result = z.infer<typeof resultSchema>
export type OrganisationUnitCodes = z.infer<typeof organisationUnitSchema>
export type Urgent = z.infer<typeof urgentSchema>
export type CriminalProsecutionReference = z.infer<typeof criminalProsecutionReferenceSchema>
export type Duration = z.infer<typeof durationSchema>
export type DefendantOrOffender = z.infer<typeof defendantOrOffenderSchema>
export type ResultQualifierVariable = z.infer<typeof resultQualifierVariableSchema>
export type DateSpecifiedInResult = z.infer<typeof dateSpecifiedInResultSchema>
export type NumberSpecifiedInResult = z.infer<typeof numberSpecifiedInResultSchema>
export type AmountSpecifiedInResult = z.infer<typeof amountSpecifiedInResultSchema>

const partialAho = annotatedHearingOutcomeSchema.deepPartial()
export type PartialAho = z.infer<typeof partialAho>
